from __future__ import annotations

import importlib
import json
from typing import TYPE_CHECKING, ClassVar, Protocol, cast

import hiveio_api
import pytest
from hiveio_api.block_api import BlockApi
from hiveio_api.client import JSONRPCResult
from hiveio_api.condenser_api import CondenserApi
from hiveio_api.database_api import DatabaseApi as BaseDatabaseApi
from hiveio_api.network_broadcast_api import NetworkBroadcastApi

from beekeepy.communication import AioHttpCommunicator, Request, Response
from beekeepy.handle.remote import AbstractAsyncApi
from beekeepy.interfaces import HttpUrl
from wax._private.api.api_caller import WaxApiCaller
from wax.api.collection import WaxApiCollection

if TYPE_CHECKING:
    from typing import ClassVar as ClassVarForTypeChecking

    from hiveio_api.block_api import BlockApi as BlockApiForTypeChecking

    from wax import IHiveChainInterface
    from wax.interfaces import ApiCollectionT


class MockApi(AbstractAsyncApi):
    @AbstractAsyncApi.endpoint_jsonrpc
    async def endpoint_test(self) -> str:  # type: ignore[empty-body]
        """Do nothing."""


class FirstApiCollection:
    def __init__(self) -> None:
        self.mock_api = MockApi


class SecondApiCollection:
    def __init__(self) -> None:
        self.second_mock_api = MockApi


class TwoApisCollection:
    def __init__(self) -> None:
        self.block_api = BlockApi
        self.condenser_api = CondenserApi


class MappedApiCollection:
    """Collection declaring its APIs as WaxApiCollection does - by `_API_MAP`."""

    block_api: BlockApi

    _API_MAP: ClassVar[dict[str, type]] = {"block_api": BlockApi}


class TypeCheckingAnnotatedApiCollection:
    """Collection annotated with names imported only for type checking - annotations are not evaluated."""

    block_api: BlockApiForTypeChecking

    _API_MAP: ClassVarForTypeChecking[dict[str, type]] = {"block_api": BlockApi}


class DatabaseApi(BaseDatabaseApi):  # the name of the class gives the name of the API
    @BaseDatabaseApi.endpoint_jsonrpc
    async def get_config(self) -> str:  # type: ignore[empty-body, override]
        """Replaced endpoint."""


class DatabaseApiCollection:
    def __init__(self) -> None:
        self.database_api = DatabaseApi


class ExtendedApis(Protocol):
    """APIs of a chain extended with TwoApisCollection or MappedApiCollection (typed view)."""

    block_api: BlockApi
    condenser_api: CondenserApi
    database_api: BaseDatabaseApi
    mock_api: MockApi


class ReplacedDatabaseApi(Protocol):
    """APIs of a chain extended with DatabaseApiCollection (typed view)."""

    database_api: DatabaseApi


@pytest.fixture
def sent_requests(monkeypatch: pytest.MonkeyPatch) -> list[dict[str, object]]:
    """JSON-RPC requests of the chain - answered with their method instead of being sent to a node."""
    requests: list[dict[str, object]] = []

    async def send(_: WaxApiCaller, *, data: str | None = None, **__: object) -> JSONRPCResult[object]:
        assert data is not None, "JSON-RPC requests have data"
        request: dict[str, object] = json.loads(data)
        requests.append(request)
        return JSONRPCResult(result=request["method"])

    monkeypatch.setattr(WaxApiCaller, "_async_send", send)
    return requests


def assert_have_base_apis_available(
    extended_chain: IHiveChainInterface[ApiCollectionT],
) -> None:
    api = cast("WaxApiCollection", extended_chain.api)
    assert isinstance(api.database_api, BaseDatabaseApi), "Extended API should have database_api."
    assert isinstance(api.network_broadcast_api, NetworkBroadcastApi), "Extended API should have network_broadcast_api."


def test_extended_and_base_api_available(
    remote_chain: IHiveChainInterface[ApiCollectionT],
) -> None:
    # ACT
    extended_chain = remote_chain.extends(FirstApiCollection)

    # ASSERT
    assert hasattr(extended_chain.api, "mock_api"), "Extended API should have mock_api attribute."
    assert hasattr(extended_chain.api.mock_api, "endpoint_test"), "test_api should have endpoint_test method."
    assert_have_base_apis_available(extended_chain)


def test_extension_has_its_own_collection_of_apis(remote_chain: IHiveChainInterface[ApiCollectionT]) -> None:
    # ACT
    extended_chain = remote_chain.extends(FirstApiCollection)

    # ASSERT
    assert extended_chain.api is not remote_chain.api, "each chain has its own collection of APIs"
    assert not hasattr(remote_chain.api, "mock_api"), "APIs of the extension are not added to the extended chain"


async def test_extended_chain_shares_the_endpoint_of_the_chain(
    remote_chain: IHiveChainInterface[ApiCollectionT], monkeypatch: pytest.MonkeyPatch
) -> None:
    # ARRANGE
    endpoint = HttpUrl("http://127.0.0.2:8090")
    urls: list[HttpUrl] = []

    async def send(_: AioHttpCommunicator, request: Request) -> Response:
        assert request.body is not None
        urls.append(request.url)
        call = json.loads(request.body)
        response = {"jsonrpc": "2.0", "id": call["id"], "result": {"accounts": []}}
        return Response(status_code=200, headers={}, body=json.dumps(response))

    monkeypatch.setattr(AioHttpCommunicator, "_async_send", send)
    extended_chain = remote_chain.extends(FirstApiCollection)

    # ACT
    extended_chain.endpoint_url = endpoint
    await cast("WaxApiCollection", remote_chain.api).database_api.find_accounts(accounts=[])

    # ASSERT
    assert remote_chain.endpoint_url == endpoint
    assert extended_chain.endpoint_url == endpoint
    assert urls == [endpoint], "requests of the extended chain are sent to the endpoint set on the extension"


def test_annotations_of_extension_are_not_evaluated(remote_chain: IHiveChainInterface[ApiCollectionT]) -> None:
    # ACT
    api = remote_chain.extends(TypeCheckingAnnotatedApiCollection).api

    # ASSERT
    assert isinstance(cast("ExtendedApis", api).block_api, BlockApi)
    assert_have_base_apis_available(remote_chain.extends(TypeCheckingAnnotatedApiCollection))


def test_teardown_of_extended_chain_leaves_the_connection_of_the_chain(
    remote_chain: IHiveChainInterface[ApiCollectionT],
) -> None:
    # ARRANGE
    extended_chain = remote_chain.extends(FirstApiCollection)
    callers = set(WaxApiCaller._INSTANCES)

    # ACT
    extended_chain.teardown()

    # ASSERT
    assert callers == WaxApiCaller._INSTANCES, "the caller shared with the chain is not torn down by the extension"


def test_double_extend_api(remote_chain: IHiveChainInterface[ApiCollectionT]) -> None:
    # ACT
    extended_chain = remote_chain.extends(FirstApiCollection)
    extended_chain_twice = extended_chain.extends(SecondApiCollection)

    # ASSERT
    assert hasattr(extended_chain_twice.api, "mock_api"), "Extended API should have mock_api attribute."
    assert hasattr(extended_chain_twice.api, "second_mock_api"), "Extended API should have second_mock_api attribute."

    assert_have_base_apis_available(extended_chain)


class CondenserApiCollection(WaxApiCollection):
    def __init__(self) -> None:
        from hiveio_api.condenser_api import CondenserApi

        self.condenser_api = CondenserApi


def test_contract_of_hiveio_api_validate_schema_takes_endpoints_of_extended_apis(
    remote_chain: IHiveChainInterface[ApiCollectionT],
) -> None:
    """Contract with hiveio_api - endpoints of APIs created by wax for an extension identify their validation models."""
    # ARRANGE
    from hiveio_api import validate_schema

    api = remote_chain.extends(CondenserApiCollection).api
    assert isinstance(api, CondenserApiCollection)

    # ACT & ASSERT
    assert validate_schema({"accounts": []}, api.database_api.find_accounts) == []
    assert validate_schema([], api.condenser_api.get_accounts) == []
    assert validate_schema([{"name": "Invalid Name!"}], api.condenser_api.get_accounts) != []


async def test_endpoints_of_extended_apis_are_called(
    remote_chain: IHiveChainInterface[ApiCollectionT], sent_requests: list[dict[str, object]]
) -> None:
    # ARRANGE
    api = cast("ExtendedApis", remote_chain.extends(TwoApisCollection).api)

    # ACT
    results: list[object] = [  # answered with methods of requests
        await api.block_api.get_block_header(block_num=1),
        await api.condenser_api.get_accounts([["alice"]]),
        await api.database_api.get_dynamic_global_properties(),
    ]

    # ASSERT
    assert results == [
        "block_api.get_block_header",
        "condenser_api.get_accounts",
        "database_api.get_dynamic_global_properties",
    ]
    assert sent_requests[0]["params"] == {"block_num": 1}


async def test_endpoints_of_twice_extended_apis_are_called(
    remote_chain: IHiveChainInterface[ApiCollectionT], sent_requests: list[dict[str, object]]
) -> None:
    # ARRANGE
    api = cast("ExtendedApis", remote_chain.extends(FirstApiCollection).extends(TwoApisCollection).api)

    # ACT
    results: list[object] = [await api.mock_api.endpoint_test(), await api.block_api.get_block_header(block_num=1)]

    # ASSERT
    assert results == ["mock_api.endpoint_test", "block_api.get_block_header"]
    assert len(sent_requests) == len(results)


async def test_endpoints_of_apis_declared_by_api_map_of_extension_are_called(
    remote_chain: IHiveChainInterface[ApiCollectionT], sent_requests: list[dict[str, object]]
) -> None:
    # ARRANGE
    api = cast("ExtendedApis", remote_chain.extends(MappedApiCollection).api)

    # ACT
    results: list[object] = [  # answered with methods of requests
        await api.block_api.get_block_header(block_num=1),
        await api.database_api.get_dynamic_global_properties(),
    ]

    # ASSERT
    assert results == ["block_api.get_block_header", "database_api.get_dynamic_global_properties"]
    assert len(sent_requests) == len(results)


async def test_extension_replaces_api_of_the_same_name(
    remote_chain: IHiveChainInterface[ApiCollectionT], sent_requests: list[dict[str, object]]
) -> None:
    # ARRANGE
    api = cast("ReplacedDatabaseApi", remote_chain.extends(DatabaseApiCollection).api)

    # ACT
    result = await api.database_api.get_config()

    # ASSERT
    assert isinstance(api.database_api, DatabaseApi)
    assert result == "database_api.get_config"
    assert [request["method"] for request in sent_requests] == ["database_api.get_config"]


@pytest.mark.parametrize("api_name", hiveio_api.APIS)
def test_every_api_of_hiveio_api_extends_the_chain(
    remote_chain: IHiveChainInterface[ApiCollectionT], api_name: str
) -> None:
    # ARRANGE
    module = importlib.import_module(f"hiveio_api.{api_name}")
    (api_class,) = (
        value
        for name in module.__all__
        if isinstance(value := getattr(module, name), type) and issubclass(value, AbstractAsyncApi)
    )
    collection = type("ApiCollection", (), {"_API_MAP": {api_name: api_class}})

    # ACT
    api = getattr(remote_chain.extends(collection).api, api_name)

    # ASSERT
    assert isinstance(api, api_class)
    assert_have_base_apis_available(remote_chain.extends(collection))
