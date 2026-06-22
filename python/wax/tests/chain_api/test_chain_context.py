from __future__ import annotations

from typing import TYPE_CHECKING, cast

from wax import WaxChainOptions, create_hive_chain
from wax._private.api.api_caller import WaxApiCaller

if TYPE_CHECKING:
    from wax._private.chain_api import HiveChainApi
    from wax.api.collection import WaxApiCollection


class _FakeApiCaller:
    def __init__(self) -> None:
        self.teardown_calls = 0
        self.async_teardown_calls = 0

    def teardown(self) -> None:
        self.teardown_calls += 1

    async def async_teardown(self) -> None:
        self.async_teardown_calls += 1


def _chain_for_context_tests() -> HiveChainApi[WaxApiCollection]:
    return cast(
        "HiveChainApi[WaxApiCollection]",
        create_hive_chain(WaxChainOptions(endpoint_url="http://127.0.0.1:1")),
    )


def test_chain_sync_context_tears_down_api_caller() -> None:
    chain = _chain_for_context_tests()
    fake = _FakeApiCaller()
    chain._api_caller = fake  # type: ignore[assignment]

    with chain as active:
        assert active is chain
        assert fake.teardown_calls == 0

    assert fake.teardown_calls == 1
    assert fake.async_teardown_calls == 0


async def test_chain_async_context_tears_down_api_caller() -> None:
    chain = _chain_for_context_tests()
    fake = _FakeApiCaller()
    chain._api_caller = fake  # type: ignore[assignment]

    async with chain as active:
        assert active is chain
        assert fake.teardown_calls == 0
        assert fake.async_teardown_calls == 0

    assert fake.teardown_calls == 0
    assert fake.async_teardown_calls == 1


async def test_chain_aclose_uses_async_teardown() -> None:
    chain = _chain_for_context_tests()
    fake = _FakeApiCaller()
    chain._api_caller = fake  # type: ignore[assignment]

    await chain.aclose()

    assert fake.teardown_calls == 0
    assert fake.async_teardown_calls == 1


def test_teardown_unregisters_api_caller_from_atexit_cleanup() -> None:
    chain = _chain_for_context_tests()
    api_caller = chain._api_caller

    assert api_caller in WaxApiCaller._INSTANCES
    chain.teardown()

    assert api_caller not in WaxApiCaller._INSTANCES
