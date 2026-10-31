from __future__ import annotations

from collections.abc import Iterator, Mapping
from importlib import import_module
from typing import TYPE_CHECKING, ClassVar

from hiveio_api.client import AbstractAsyncApiCollection

if TYPE_CHECKING:
    from hiveio_api.database_api.database_api_client import DatabaseApi
    from hiveio_api.network_broadcast_api.network_broadcast_api_client import NetworkBroadcastApi
    from hiveio_api.rc_api.rc_api_client import RcApi


class _LazyApiMap(Mapping[str, type]):
    """Map of API classes given by their import paths (`module.Class`) - imported on first access to shorten import."""

    def __init__(self, **paths: str) -> None:
        self._paths = paths
        self._apis: dict[str, type] = {}

    def __getitem__(self, api_name: str) -> type:
        if api_name not in self._apis:
            module, _, class_name = self._paths[api_name].rpartition(".")
            self._apis[api_name] = getattr(import_module(module), class_name)
        return self._apis[api_name]

    def __iter__(self) -> Iterator[str]:
        return iter(self._paths)

    def __len__(self) -> int:
        return len(self._paths)


class WaxApiCollection(AbstractAsyncApiCollection):
    """
    APIs of a chain - declared by `_API_MAP`, created with their owner by `api_collection_factory`.

    Collections are templates - created without arguments (also the ones joined by `extends`). API classes of
    `_API_MAP` of this collection are imported when the collection is created for the first time.
    """

    database_api: DatabaseApi
    network_broadcast_api: NetworkBroadcastApi
    rc_api: RcApi

    _API_MAP: ClassVar[Mapping[str, type]] = _LazyApiMap(
        database_api="hiveio_api.database_api.database_api_client.DatabaseApi",
        network_broadcast_api="hiveio_api.network_broadcast_api.network_broadcast_api_client.NetworkBroadcastApi",
        rc_api="hiveio_api.rc_api.rc_api_client.RcApi",
    )

    def __init__(self) -> None:
        """Owner and callbacks of the collection are set by `api_collection_factory`."""
