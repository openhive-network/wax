from __future__ import annotations

import logging

import pytest
from loguru import logger

import test_tools as tt
from test_tools.__private.scope.scope_fixtures import *  # noqa: F403


@pytest.fixture(autouse=True)
def _disable_logging() -> None:
    logger.disable("helpy")


def pytest_sessionstart() -> None:
    # Turn off unnecessary logs
    logging.getLogger("urllib3.connectionpool").propagate = False
    tt.logger.enable("test_tools")


@pytest.fixture(name="node")
def _node() -> tt.InitNode:  # noqa: PT005
    node = tt.InitNode()
    node.run()
    return node
