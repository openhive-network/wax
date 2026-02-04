from __future__ import annotations

from typing import TYPE_CHECKING

from beekeepy.handle.remote import AbstractAsyncApi

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


def assert_have_base_apis_available(extended_chain: IHiveChainInterface[ApiCollectionT]) -> None:
    assert hasattr(extended_chain.api, "database_api"), "Extended API should have database_api."
    assert hasattr(extended_chain.api, "network_broadcast_api"), "Extended API should have network_broadcast_api."


def test_extended_and_base_api_available(remote_chain: IHiveChainInterface[ApiCollectionT]) -> None:
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
