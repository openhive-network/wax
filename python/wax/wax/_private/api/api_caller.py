from __future__ import annotations

import atexit
from functools import partial
from typing import TYPE_CHECKING, Any, ClassVar, Literal

from beekeepy.exceptions import CommunicationError
from beekeepy.handle.remote import AbstractAsyncHandle, AsyncBatchHandle, RemoteHandleSettings
from wax._private.api.overseer import WaxAssertionInResponseError, WaxOverseer
from wax.exceptions.wax_error import WaxCommunicationError
from wax.interfaces import ApiCollectionT

if TYPE_CHECKING:
    from schemas.jsonrpc import ExpectResultT, JSONRPCResult

    from beekeepy._communication.abc.communicator_models import AsyncCallbacks, Methods
    from beekeepy._communication.url import HttpUrl as CommunicationHttpUrl
    from beekeepy.handle.remote import AsyncSendable
    from beekeepy.interfaces import HttpUrl


def api_collection_factory(api_collection: ApiCollectionT, owner: AsyncSendable) -> ApiCollectionT:
    """Initializes the API collection with the owner."""
    api_map = getattr(type(api_collection), "_API_MAP", None)
    if api_map is not None:
        items = api_map.items()
    else:
        items = ((k, v) for k, v in api_collection.__dict__.items() if callable(v) and not k.startswith("_"))

    for api_name, api_definition in items:
        setattr(api_collection, api_name, api_definition(owner=owner))

    return api_collection


class WaxApiCaller(AbstractAsyncHandle[RemoteHandleSettings, ApiCollectionT]):  # type: ignore[type-var]
    _INSTANCES: ClassVar[set[WaxApiCaller[Any]]] = set()

    def __init__(self, api_collection: ApiCollectionT, endpoint_url: HttpUrl) -> None:
        self._api_collection = api_collection  # assigned here because `_constuct_api` method
        # is called in the constructor of the parent class
        settings = RemoteHandleSettings()
        settings.http_endpoint = endpoint_url
        settings.overseer = WaxOverseer
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

    async def batch(self, *, delay_error_on_data_access: bool = False) -> AsyncBatchHandle:
        return AsyncBatchHandle(
            url=self.http_endpoint,
            overseer=self._overseer,
            api=partial(api_collection_factory, self._api_collection),
            delay_error_on_data_access=delay_error_on_data_access,
        )

    async def _async_send(  # noqa: PLR0913
        self,
        *,
        method: Methods,
        expected_type: type[ExpectResultT],
        serialization_type: Literal["hf26", "legacy"],
        data: str | None = None,
        url: CommunicationHttpUrl | None = None,
        callbacks: AsyncCallbacks | None = None,
    ) -> JSONRPCResult[ExpectResultT]:
        try:
            return await super()._async_send(
                method=method,
                expected_type=expected_type,
                serialization_type=serialization_type,
                data=data,
                url=url,
                callbacks=callbacks,
            )
        except WaxAssertionInResponseError as ex:
            raise ex.wax_exception from ex
        except CommunicationError as ex:
            raise WaxCommunicationError(str(ex)) from ex

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
