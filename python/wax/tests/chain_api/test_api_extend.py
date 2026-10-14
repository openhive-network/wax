from __future__ import annotations

import json
from typing import TYPE_CHECKING, ClassVar, Protocol, cast

import pytest
from hiveio_api._communication.jsonrpc import JSONRPCResult
from hiveio_api.block_api import BlockApi
from hiveio_api.condenser_api import CondenserApi
from hiveio_api.database_api import DatabaseApi as BaseDatabaseApi
from hiveio_api.network_broadcast_api import NetworkBroadcastApi

from beekeepy.handle.remote import AbstractAsyncApi
from wax._private.api.api_caller import WaxApiCaller
from wax.api.collection import WaxApiCollection

if TYPE_CHECKING:
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
    """Collection declaring its APIs as WaxApiCollection does."""

    block_api: BlockApi

    _API_MAP: ClassVar[dict[str, type]] = {"block_api": BlockApi}


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


def test_validate_schema_accepts_endpoints_of_extended_apis(remote_chain: IHiveChainInterface[ApiCollectionT]) -> None:
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


async def test_endpoints_of_apis_mapped_by_extension_are_called(
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
