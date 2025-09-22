from __future__ import annotations

import atexit
from functools import partial
from typing import TYPE_CHECKING, Any, ClassVar

from beekeepy.handle.remote import AbstractAsyncHandle, AsyncBatchHandle, RemoteHandleSettings
from wax.interfaces import ApiCollectionT

if TYPE_CHECKING:
    from beekeepy.handle.remote import AsyncSendable
    from beekeepy.interfaces import HttpUrl


def api_collection_factory(api_collection: ApiCollectionT, owner: AsyncSendable) -> ApiCollectionT:
    """Initializes the API collection with the owner."""
    for api_name, api_definition in api_collection.__dict__.items():
        if callable(api_definition) and not api_name.startswith("_"):  # Check for magic methods
            setattr(api_collection, api_name, api_definition(owner=owner))

    return api_collection


class WaxApiCaller(AbstractAsyncHandle[RemoteHandleSettings, ApiCollectionT]):  # type: ignore[type-var]
    _INSTANCES: ClassVar[set[WaxApiCaller[Any]]] = set()

    def __init__(self, api_collection: ApiCollectionT, endpoint_url: HttpUrl) -> None:
        self._api_collection = api_collection  # assigned here because `_constuct_api` method
        # is called in the constructor of the parent class
        settings = RemoteHandleSettings()
        settings.http_endpoint = endpoint_url
        super().__init__(settings=settings)
        self._INSTANCES.add(self)

    def set_endpoint_url(self, endpoint_url: HttpUrl, *, _private: bool = False) -> None:
        assert _private, (
            "Endpoint url should not be set by this method. "
            "Please modify `endpoint_url` property instead in the `HiveChainApi`."
        )
        self.http_endpoint = endpoint_url

    @property
    def api(self) -> ApiCollectionT:
        return super().api

    async def batch(self, *, delay_error_on_data_access: bool = False) -> AsyncBatchHandle[ApiCollectionT]:
        return AsyncBatchHandle(
            url=self.http_endpoint,
            overseer=self._overseer,
            api=partial(api_collection_factory, self._api_collection),
            delay_error_on_data_access=delay_error_on_data_access,
        )

    def _construct_api(self) -> ApiCollectionT:
        return api_collection_factory(self._api_collection, self)

    def _target_service(self) -> str:
        return "wax_api_caller"


def _cleanup_instances() -> None:
    """Cleanup all WaxApiCaller instances before interpreter shutdown."""
    for instance in WaxApiCaller._INSTANCES:
        instance.teardown()

    WaxApiCaller._INSTANCES.clear()


atexit.register(_cleanup_instances)
