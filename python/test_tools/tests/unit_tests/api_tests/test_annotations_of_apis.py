from __future__ import annotations

import importlib
import inspect
import pkgutil
from typing import get_type_hints

import pytest
from beekeepy.handle.remote import AbstractSyncApi

import test_tools.__private.hived.api as apis


def _sync_apis() -> list[type[AbstractSyncApi]]:
    """API classes of the synchronous clients of test_tools (`hived/api/<api>/sync_api.py`)."""
    classes: list[type[AbstractSyncApi]] = []
    for package in pkgutil.iter_modules(apis.__path__):
        if not package.ispkg:
            continue
        module = importlib.import_module(f"{apis.__name__}.{package.name}.sync_api")
        classes.extend(
            api
            for _, api in inspect.getmembers(module, inspect.isclass)
            if api.__module__ == module.__name__ and issubclass(api, AbstractSyncApi)
        )
    return classes


@pytest.mark.parametrize("api", _sync_apis(), ids=lambda api: api.__name__)
def test_annotations_of_endpoints_are_resolved_at_runtime(api: type[AbstractSyncApi]) -> None:
    # ARRANGE
    endpoints = {
        name: member
        for name, member in vars(api).items()
        if callable(member) and getattr(member, "__module__", None) == api.__module__
    }
    assert endpoints, f"{api.__name__} declares endpoints"

    # ACT & ASSERT
    for name, endpoint in endpoints.items():
        assert "return" in get_type_hints(endpoint), f"{api.__name__}.{name} annotates its result"
