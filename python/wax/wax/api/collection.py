from __future__ import annotations

from collections.abc import Iterator, Mapping
from importlib import import_module
from typing import TYPE_CHECKING, ClassVar, Final, TypeVar, cast

from hiveio_api.client import AbstractAsyncApi, AbstractAsyncApiCollection

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


ApiT = TypeVar("ApiT", bound=AbstractAsyncApi)

API_MAP_ATTRIBUTE: Final[str] = "_API_MAP"
"""Attribute of collection classes recording their APIs - names of attributes to API classes (merged along the MRO)."""


def declare_api(api: type[ApiT]) -> ApiT:
    """
    Declare an API of a collection - the attribute of the collection is the instance of the API, created by wax.

    Example:
        ```python
        class MyApis(WaxApiCollection):
            hello_api = declare_api(HelloApi)

        await chain.extends(MyApis).api.hello_api.world()
        ```

    Type checkers see the attribute as the instance of the API - its endpoints with `callbacks` and
    `set_validation_mask`. When the class is created, the declaration records the API in the class (its own
    `_API_MAP`, merged with the maps of the base classes by wax) and leaves the body of the class.

    Args:
        api: The API class.
    """
    return cast("ApiT", _ApiDeclaration(api))


class _ApiDeclaration:
    """`declare_api` in the body of a collection - records the API in the class when the class is created."""

    def __init__(self, api: type[AbstractAsyncApi]) -> None:
        self.__api = api

    def __set_name__(self, owner: type[object], name: str) -> None:
        own_apis: Mapping[str, type] = vars(owner).get(API_MAP_ATTRIBUTE, {})  # not the map of a base class
        setattr(owner, API_MAP_ATTRIBUTE, {**own_apis, name: self.__api})
        delattr(owner, name)  # the attribute is the instance of the API, set by wax

    def __getattr__(self, name: str) -> object:
        raise AttributeError(
            f"`declare_api({self.__api.__name__})` declares an API in the body of an API collection - the instance of "
            f"the API is in a collection of a chain (`chain.extends(Collection).api`), no `{name}` here."
        )


class WaxApiCollection(AbstractAsyncApiCollection):
    """
    APIs of a chain - declared by `declare_api` (or `_API_MAP`), created with their owner by `api_collection_factory`.

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
