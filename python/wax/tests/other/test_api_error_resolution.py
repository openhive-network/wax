from __future__ import annotations

import json
from typing import TYPE_CHECKING

import pytest

from beekeepy.communication import Abort, AioHttpCommunicator, Request, RequestContext, Response
from beekeepy.exceptions import CommunicationError, ErrorInResponseError
from beekeepy.interfaces import HttpUrl
from wax import WaxChainOptions, create_hive_chain
from wax._private.api.rules import WaxAssertionInResponseError, WaxErrorInResponse, WaxRules, error_of_wax
from wax.exceptions import (
    WaxAssertionError,
    WaxCommunicationError,
    WaxError,
    WaxInsufficientBalanceError,
    WaxInvalidAccountNameError,
    WaxUnhandledAssertionError,
)
from wax.exceptions.wax_specialised_errors import resolve_api_response_error, resolve_exception

if TYPE_CHECKING:
    from collections.abc import AsyncIterator

    from wax import IHiveChainInterface
    from wax.api.collection import WaxApiCollection

# ---------------------------------------------------------------------------
# Sample structured error data matching CxxExceptionData schema
# ---------------------------------------------------------------------------


def _make_jsonrpc_error_response(data: dict | None = None, message: str = "Assert Exception") -> dict:
    """Build a minimal JSON-RPC error response."""
    error: dict = {"code": -32003, "message": message}
    if data is not None:
        error["data"] = data
    return {"jsonrpc": "2.0", "id": 1, "error": error}


def _make_assertion_data(
    *,
    category: str = "chain",
    subject_type: str = "balance",
    subject: str | None = "HIVE",
    name: str = "assert_exception",
) -> dict:
    """Build structured hived assertion data matching CxxExceptionData schema."""
    frame_data: dict = {"category": category}
    if subject is not None:
        frame_data["subject_type"] = subject_type
        frame_data["subject"] = subject
    return {
        "assert_hash": "12345",
        "code": 10,
        "extension": {"assertion_expression": "balance >= amount"},
        "message": "Assert Exception",
        "name": name,
        "stack": [
            {
                "context": {
                    "level": "error",
                    "file": "evaluator.cpp",
                    "line": 100,
                    "method": "do_apply",
                    "hostname": "node1",
                    "thread_name": "main",
                },
                "format": "Insufficient balance: ${subject}",
                "data": frame_data,
            }
        ],
    }


def _make_url() -> HttpUrl:
    return HttpUrl.factory(address="127.0.0.1", port=8090, protocol="http")


# ---------------------------------------------------------------------------
# Tests for resolve_api_response_error()
# ---------------------------------------------------------------------------


class TestResolveApiResponseError:
    def test_returns_assertion_error_for_structured_chain_data(self) -> None:
        data = _make_assertion_data(category="chain", subject_type="balance")
        response = _make_jsonrpc_error_response(data=data)

        result = resolve_api_response_error(response)

        assert isinstance(result, WaxInsufficientBalanceError)
        assert result.category == "chain"
        assert result.subject_type == "balance"

    def test_returns_assertion_error_for_protocol_data(self) -> None:
        data = _make_assertion_data(category="protocol", subject_type="account_name", subject="in")
        response = _make_jsonrpc_error_response(data=data)

        result = resolve_api_response_error(response)

        assert isinstance(result, WaxInvalidAccountNameError)
        assert result.category == "protocol"

    def test_returns_unhandled_for_unknown_category(self) -> None:
        data = _make_assertion_data(category="unknown", subject_type="other", subject=None)
        data["stack"][0]["data"] = {"category": "unknown"}
        data["stack"][0]["format"] = "Unknown error occurred"
        response = _make_jsonrpc_error_response(data=data)

        result = resolve_api_response_error(response)

        assert isinstance(result, WaxUnhandledAssertionError)

    def test_returns_none_without_error_field(self) -> None:
        response: dict = {"jsonrpc": "2.0", "id": 1, "result": {}}

        assert resolve_api_response_error(response) is None

    def test_returns_none_without_data_field(self) -> None:
        response = _make_jsonrpc_error_response(data=None)

        assert resolve_api_response_error(response) is None

    def test_returns_none_for_non_dict_data(self) -> None:
        response: dict = {"jsonrpc": "2.0", "id": 1, "error": {"code": -32000, "message": "err", "data": "string"}}

        assert resolve_api_response_error(response) is None

    def test_returns_none_when_data_lacks_name_or_stack(self) -> None:
        response = _make_jsonrpc_error_response(data={"code": 10, "message": "some error"})

        assert resolve_api_response_error(response) is None

    def test_returns_wax_error_for_unparseable_structured_data(self) -> None:
        """Data has name+stack but doesn't match CxxExceptionData schema fully."""
        response = _make_jsonrpc_error_response(data={"name": "some_exception", "stack": "not_a_list"})

        result = resolve_api_response_error(response)

        assert isinstance(result, WaxError)

    def test_assert_hash_preserved(self) -> None:
        data = _make_assertion_data(category="chain", subject_type="balance")
        response = _make_jsonrpc_error_response(data=data)

        result = resolve_api_response_error(response)

        assert isinstance(result, WaxAssertionError)
        assert result.assert_hash == "12345"

    def test_raw_data_accessible(self) -> None:
        data = _make_assertion_data(category="chain", subject_type="balance")
        response = _make_jsonrpc_error_response(data=data)

        result = resolve_api_response_error(response)

        assert isinstance(result, WaxAssertionError)
        assert result.raw.name == "assert_exception"
        assert result.raw.extension.assertion_expression == "balance >= amount"
        assert result.raw.code == 10

    def test_formatted_message(self) -> None:
        data = _make_assertion_data(category="chain", subject_type="balance")
        response = _make_jsonrpc_error_response(data=data)

        result = resolve_api_response_error(response)

        assert isinstance(result, WaxAssertionError)
        assert "Chain" in result.message or "chain" in result.message.lower()


# ---------------------------------------------------------------------------
# Tests for resolve_exception() with dict input (API error data path)
# ---------------------------------------------------------------------------


class TestResolveExceptionWithDict:
    """Verify that resolve_exception() handles dict input matching CxxExceptionData."""

    def test_dict_input_resolves_to_assertion(self) -> None:
        data = _make_assertion_data(category="chain", subject_type="balance")

        result = resolve_exception(data)

        assert isinstance(result, WaxInsufficientBalanceError)

    def test_invalid_dict_falls_back_to_wax_error(self) -> None:
        result = resolve_exception({"not": "valid"})

        assert isinstance(result, WaxError)
        assert not isinstance(result, WaxAssertionError)


# ---------------------------------------------------------------------------
# Tests for WaxErrorInResponse rule
# ---------------------------------------------------------------------------


def _context(response: dict[str, object], exception: Exception | None = None) -> RequestContext:
    return RequestContext(
        request=Request(
            url=_make_url(), method="POST", headers={}, body='{"jsonrpc": "2.0", "id": 1, "method": "a.b"}'
        ),
        response=Response(status_code=200, headers={}, body=json.dumps(response)),
        exception=exception,
    )


class TestWaxErrorInResponseRule:
    def test_detects_structured_assertion_in_response(self) -> None:
        data = _make_assertion_data(category="chain", subject_type="balance")

        errors = WaxErrorInResponse().check(_context(_make_jsonrpc_error_response(data=data)))

        assert len(errors) == 1
        assert isinstance(errors[0], WaxAssertionInResponseError)
        assert isinstance(errors[0].wax_exception, WaxInsufficientBalanceError)

    def test_returns_empty_for_non_assertion_error(self) -> None:
        response = _make_jsonrpc_error_response(data=None, message="Some generic error")

        assert WaxErrorInResponse().check(_context(response)) == []

    def test_returns_empty_for_success_response(self) -> None:
        assert WaxErrorInResponse().check(_context({"jsonrpc": "2.0", "id": 1, "result": {}})) == []

    def test_structured_assertions_abort_the_request(self) -> None:
        data = _make_assertion_data(category="chain", subject_type="balance")

        with pytest.raises(Abort) as signal:
            WaxRules()(_context(_make_jsonrpc_error_response(data=data)))

        assert [type(error) for error in signal.value.errors] == [WaxAssertionInResponseError], "not retried"


class TestErrorsOfWax:
    """Errors of requests (detected by rules or of sending) are raised as errors of wax."""

    def test_assertion_is_raised_as_its_wax_assertion_error(self) -> None:
        resolved = resolve_exception(_make_assertion_data())
        assert isinstance(resolved, WaxAssertionError)
        detected = WaxAssertionInResponseError(
            url="http://localhost:8090", request=b"{}", request_id=1, wax_exception=resolved
        )

        assert error_of_wax(detected) is resolved

    def test_other_errors_are_raised_as_wax_communication_errors(self) -> None:
        detected = ErrorInResponseError(url="http://localhost:8090", request=b"{}", request_id=1, message="locked")

        error = error_of_wax(detected)

        assert type(error) is WaxCommunicationError
        assert "locked" in str(error)

    def test_errors_of_sending_are_raised_as_wax_communication_errors(self) -> None:
        error = CommunicationError(url="http://localhost:8090", request=b"{}", message="connection refused")

        assert type(error_of_wax(error)) is WaxCommunicationError
        assert "connection refused" in str(error_of_wax(error))


_GOOD_METHOD = "database_api.find_accounts"
_BAD_METHOD = "database_api.get_dynamic_global_properties"


@pytest.fixture
def responses(monkeypatch: pytest.MonkeyPatch) -> dict[str, dict]:
    """Responses of the node (without `jsonrpc` and `id`) by methods - answered instead of sending requests."""
    by_method: dict[str, dict] = {
        _GOOD_METHOD: {"result": {"accounts": []}},
        _BAD_METHOD: _make_jsonrpc_error_response(data=_make_assertion_data()),
    }

    async def send(_: AioHttpCommunicator, request: Request) -> Response:
        assert request.body is not None
        sent = json.loads(request.body)
        is_batch = isinstance(sent, list)
        calls = sent if is_batch else [sent]
        answers = [{**by_method[call["method"]], "jsonrpc": "2.0", "id": call["id"]} for call in calls]
        return Response(status_code=200, headers={}, body=json.dumps(answers if is_batch else answers[0]))

    monkeypatch.setattr(AioHttpCommunicator, "_async_send", send)
    return by_method


@pytest.fixture
async def chain() -> AsyncIterator[IHiveChainInterface[WaxApiCollection]]:
    chain = create_hive_chain(WaxChainOptions(endpoint_url="http://127.0.0.1:1"))
    yield chain
    await chain.async_teardown()


class _ExtensionApiCollection:
    """Collection without APIs - its chain sends requests with APIs of the extended chain."""


@pytest.mark.usefixtures("responses")
class TestErrorsOfRequestsOfChain:
    """Responses of APIs of chains are checked by rules of wax - errors are raised as errors of wax."""

    @pytest.mark.parametrize("extended", [False, True], ids=["chain", "extended_chain"])
    async def test_structured_assertion_is_raised_as_wax_assertion_error(
        self,
        chain: IHiveChainInterface[WaxApiCollection],
        extended: bool,  # noqa: FBT001
    ) -> None:
        api = chain.extends(_ExtensionApiCollection).api if extended else chain.api

        with pytest.raises(WaxInsufficientBalanceError):
            await api.database_api.get_dynamic_global_properties()

    async def test_api_not_found_is_raised_as_wax_communication_error(
        self, chain: IHiveChainInterface[WaxApiCollection], responses: dict[str, dict]
    ) -> None:
        responses[_BAD_METHOD] = _make_jsonrpc_error_response(
            message="Assert Exception:api_itr != data._registered_apis.end(): Could not find API database_api"
        )

        with pytest.raises(WaxCommunicationError, match="Requested api not found: database_api"):
            await chain.api.database_api.get_dynamic_global_properties()

    async def test_callbacks_of_errors_are_called_before_the_error_of_wax_is_raised(
        self, chain: IHiveChainInterface[WaxApiCollection]
    ) -> None:
        errors: list[tuple[str, BaseException | None]] = []
        endpoint = chain.api.database_api.get_dynamic_global_properties
        chain.api.callbacks.error.append(lambda context: errors.append(("collection", context.exception)))
        chain.api.database_api.callbacks.error.append(lambda context: errors.append(("api", context.exception)))
        endpoint.callbacks.error.append(lambda context: errors.append(("endpoint", context.exception)))

        with pytest.raises(WaxInsufficientBalanceError):
            await endpoint()

        assert [owner for owner, _ in errors] == ["collection", "api", "endpoint"]
        assert all(isinstance(error, Abort) for _, error in errors), "callbacks get errors detected by rules"

    async def test_errors_of_requests_of_batch_are_raised_as_errors_of_wax(
        self, chain: IHiveChainInterface[WaxApiCollection]
    ) -> None:
        caller = chain._api_caller  # type: ignore[attr-defined]  # batches are not a part of the interface of chains

        with pytest.raises(WaxInsufficientBalanceError):  # noqa: PT012  # raised when the batch is sent
            async with await caller.batch() as batch:
                await batch.api.database_api.find_accounts(accounts=[])
                await batch.api.database_api.get_dynamic_global_properties()

    async def test_delayed_errors_of_requests_of_batch_are_raised_as_errors_of_wax(
        self, chain: IHiveChainInterface[WaxApiCollection]
    ) -> None:
        caller = chain._api_caller  # type: ignore[attr-defined]  # batches are not a part of the interface of chains

        async with await caller.batch(delay_error_on_data_access=True) as batch:
            found = await batch.api.database_api.find_accounts(accounts=[])
            properties = await batch.api.database_api.get_dynamic_global_properties()

        assert found.accounts == [], "results of correct responses are available"
        with pytest.raises(WaxInsufficientBalanceError):
            _ = properties.head_block_number

    async def test_errors_of_sending_batch_are_raised_as_errors_of_wax(
        self, chain: IHiveChainInterface[WaxApiCollection], monkeypatch: pytest.MonkeyPatch
    ) -> None:
        async def send(_: AioHttpCommunicator, request: Request) -> Response:
            raise CommunicationError(url=request.url, request=request.body or "", message="connection refused")

        monkeypatch.setattr(AioHttpCommunicator, "_async_send", send)
        caller = chain._api_caller  # type: ignore[attr-defined]  # batches are not a part of the interface of chains

        with pytest.raises(WaxCommunicationError, match="connection refused"):
            async with await caller.batch(delay_error_on_data_access=True) as batch:
                await batch.api.database_api.find_accounts(accounts=[])


class TestCommunicationErrorFallback:
    """Verify that CommunicationError is wrapped as WaxCommunicationError."""

    def test_communication_error_becomes_wax_communication_error(self) -> None:
        import asyncio
        import socket

        from wax import WaxChainOptions, create_hive_chain

        with socket.socket() as sock:  # a port nothing listens on
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]

        async def call_api() -> None:
            chain = create_hive_chain(WaxChainOptions(endpoint_url=f"http://127.0.0.1:{port}"))
            try:
                await chain.api.database_api.get_dynamic_global_properties()
            finally:
                await chain.async_teardown()

        with pytest.raises(WaxCommunicationError) as exc_info:
            asyncio.run(call_api())

        assert isinstance(exc_info.value, WaxError)
        assert isinstance(exc_info.value.__cause__, CommunicationError)
