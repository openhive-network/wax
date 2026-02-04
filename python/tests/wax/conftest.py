from __future__ import annotations

import pytest


def pytest_addoption(parser: pytest.Parser) -> None:
    parser.addoption(
        "--proxy-mock-server-endpoint", action="store", type=str, help="specifies http_endpoint of proxy-mock-server."
    )
