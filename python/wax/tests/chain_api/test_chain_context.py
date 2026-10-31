from __future__ import annotations

from typing import TYPE_CHECKING, cast

import pytest

from wax import WaxChainOptions, create_hive_chain
from wax._private.api.api_caller import WaxApiCaller

if TYPE_CHECKING:
    from wax._private.chain_api import HiveChainApi
    from wax.api.collection import WaxApiCollection


@pytest.fixture
def teardowns(monkeypatch: pytest.MonkeyPatch) -> list[str]:
    """Teardowns of API callers of chains (`sync` or `async`) - recorded instead of closing their communication."""
    calls: list[str] = []

    def teardown(_: WaxApiCaller) -> None:
        calls.append("sync")

    async def async_teardown(_: WaxApiCaller) -> None:
        calls.append("async")

    monkeypatch.setattr(WaxApiCaller, "teardown", teardown)
    monkeypatch.setattr(WaxApiCaller, "async_teardown", async_teardown)
    return calls


def _chain_for_context_tests() -> HiveChainApi[WaxApiCollection]:
    return cast(
        "HiveChainApi[WaxApiCollection]",
        create_hive_chain(WaxChainOptions(endpoint_url="http://127.0.0.1:1")),
    )


def test_chain_sync_context_tears_down_api_caller(teardowns: list[str]) -> None:
    chain = _chain_for_context_tests()

    with chain as active:
        assert active is chain
        assert teardowns == []

    assert teardowns == ["sync"]


async def test_chain_async_context_tears_down_api_caller(teardowns: list[str]) -> None:
    chain = _chain_for_context_tests()

    async with chain as active:
        assert active is chain
        assert teardowns == []

    assert teardowns == ["async"]


async def test_chain_aclose_uses_async_teardown(teardowns: list[str]) -> None:
    chain = _chain_for_context_tests()

    await chain.aclose()

    assert teardowns == ["async"]


def test_teardown_unregisters_api_caller_from_atexit_cleanup() -> None:
    chain = _chain_for_context_tests()
    api_caller = chain._api_caller

    assert api_caller in WaxApiCaller._INSTANCES
    chain.teardown()

    assert api_caller not in WaxApiCaller._INSTANCES
