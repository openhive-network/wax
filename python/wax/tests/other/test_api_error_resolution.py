from __future__ import annotations

from beekeepy._communication.url import HttpUrl
from wax._private.api.overseer import WaxAssertionInResponseError, WaxErrorInResponse
from wax.exceptions.wax_error import (
    WaxAssertionError,
    WaxChainBalanceAssertionError,
    WaxError,
    WaxProtocolAccountNameAssertionError,
    WaxUnhandledAssertionError,
)
from wax.exceptions.wax_specialised_errors import resolve_api_response_error, resolve_exception

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

        assert isinstance(result, WaxChainBalanceAssertionError)
        assert result.category == "chain"
        assert result.subject_type == "balance"

    def test_returns_assertion_error_for_protocol_data(self) -> None:
        data = _make_assertion_data(category="protocol", subject_type="account_name", subject="in")
        response = _make_jsonrpc_error_response(data=data)

        result = resolve_api_response_error(response)

        assert isinstance(result, WaxProtocolAccountNameAssertionError)
        assert result.category == "protocol"

    def test_returns_unhandled_for_unknown_category(self) -> None:
        data = _make_assertion_data(category="unknown", subject_type="other", subject=None)
        data["stack"][0]["data"] = {"category": "unknown"}
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

        assert isinstance(result, WaxChainBalanceAssertionError)

    def test_invalid_dict_falls_back_to_wax_error(self) -> None:
        result = resolve_exception({"not": "valid"})

        assert isinstance(result, WaxError)
        assert not isinstance(result, WaxAssertionError)


# ---------------------------------------------------------------------------
# Tests for WaxErrorInResponse rule
# ---------------------------------------------------------------------------


class TestWaxErrorInResponseRule:
    def test_detects_structured_assertion_in_response(self) -> None:
        url = _make_url()
        rule = WaxErrorInResponse(url=url, request={"jsonrpc": "2.0", "id": 1, "method": "test"})

        data = _make_assertion_data(category="chain", subject_type="balance")
        response = _make_jsonrpc_error_response(data=data)

        errors = rule._check_single(parsed_response=response, whole_response=response)

        assert len(errors) == 1
        assert isinstance(errors[0], WaxAssertionInResponseError)
        assert isinstance(errors[0].wax_exception, WaxChainBalanceAssertionError)

    def test_returns_empty_for_non_assertion_error(self) -> None:
        url = _make_url()
        rule = WaxErrorInResponse(url=url, request={"jsonrpc": "2.0", "id": 1, "method": "test"})

        response = _make_jsonrpc_error_response(data=None, message="Some generic error")

        errors = rule._check_single(parsed_response=response, whole_response=response)

        assert errors == []

    def test_returns_empty_for_success_response(self) -> None:
        url = _make_url()
        rule = WaxErrorInResponse(url=url, request={"jsonrpc": "2.0", "id": 1, "method": "test"})

        response: dict = {"jsonrpc": "2.0", "id": 1, "result": {}}

        errors = rule._check_single(parsed_response=response, whole_response=response)

        assert errors == []

    def test_wax_assertion_in_response_error_no_retry(self) -> None:
        data = _make_assertion_data()
        resolved = resolve_exception(data)
        assert isinstance(resolved, WaxAssertionError)

        exc = WaxAssertionInResponseError(
            url="http://localhost:8090",
            request=b"{}",
            request_id=1,
            wax_exception=resolved,
        )
        assert exc.retry() is False
