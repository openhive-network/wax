from __future__ import annotations

import pytest

from wax import IHiveChainInterface, WaxChainOptions, create_hive_chain


@pytest.fixture(scope="session")
def proxy_mock_server_endpoint(request: pytest.FixtureRequest) -> str:
    return request.config.getoption("--proxy-mock-server-endpoint")  # type: ignore[no-any-return]


@pytest.fixture
def remote_chain(proxy_mock_server_endpoint: str) -> IHiveChainInterface:
    return create_hive_chain(WaxChainOptions(endpoint_url=proxy_mock_server_endpoint))
