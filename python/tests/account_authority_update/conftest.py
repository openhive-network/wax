from __future__ import annotations

import pytest

from tests.utils.refs import MAINNET_CHAIN_ID
from wax import IHiveChainInterface, create_hive_chain, WaxChainOptions


@pytest.fixture(scope="session")
def proxy_mock_server_endpoint(request: pytest.FixtureRequest) -> str:
    return request.config.getoption("--proxy-mock-server-endpoint")


@pytest.fixture()
def remote_chain(proxy_mock_server_endpoint) -> IHiveChainInterface:
    return create_hive_chain(
        WaxChainOptions(
            chain_id=MAINNET_CHAIN_ID,
            endpoint_url=proxy_mock_server_endpoint,
        )
    )
