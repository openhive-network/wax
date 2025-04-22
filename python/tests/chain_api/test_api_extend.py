from __future__ import annotations

from typing import TYPE_CHECKING

from beekeepy.handle.remote import AbstractAsyncApi

if TYPE_CHECKING:
    from wax import IHiveChainInterface
    from wax.interfaces import ApiCollectionT


class TestApi(AbstractAsyncApi):
    @AbstractAsyncApi.endpoint
    async def endpoint_test(self) -> str:  # type: ignore[empty-body]
        """Do nothing."""


class TestApiCollection:
    def __init__(self) -> None:
        super().__init__()
        self.test_api = TestApi


class SecondTestApiCollection:
    def __init__(self) -> None:
        super().__init__()
        self.second_test_api = TestApi


def assert_has_base_apis_available(extended_chain: IHiveChainInterface[ApiCollectionT]) -> None:
    assert hasattr(extended_chain.api, "database_api"), "Extended API should have database_api."
    assert hasattr(extended_chain.api, "network_broadcast_api"), "Extended API should have network_broadcast_api."


def test_extend_api(remote_chain: IHiveChainInterface[ApiCollectionT]) -> None:
    # ACT
    extended_chain = remote_chain.extends(TestApiCollection)

    # ASSERT
    assert hasattr(extended_chain.api, "test_api"), "Extended API should have test_api attribute."
    assert hasattr(extended_chain.api.test_api, "endpoint_test"), "test_api should have endpoint_test method."
    assert_has_base_apis_available(extended_chain)


def test_double_extend_api(remote_chain: IHiveChainInterface[ApiCollectionT]) -> None:
    # ACT
    extended_chain = remote_chain.extends(TestApiCollection)
    extended_chain_twice = extended_chain.extends(SecondTestApiCollection)

    # ASSERT
    assert hasattr(extended_chain_twice.api, "test_api"), "Extended API should have test_api attribute."
    assert hasattr(extended_chain_twice.api.test_api, "endpoint_test"), "test_api should have endpoint_test method."

    assert_has_base_apis_available(extended_chain)

    assert hasattr(extended_chain_twice.api, "second_test_api"), "Extended API should have second_test_api attribute."
