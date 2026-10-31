from __future__ import annotations

import atexit
from functools import partial
from typing import TYPE_CHECKING, Any, ClassVar, TypeGuard, TypeVar

from hiveio_api.client import AbstractAsyncApi, AbstractAsyncApiCollection

from beekeepy.exceptions import CommunicationError
from beekeepy.handle.remote import AbstractAsyncHandle, AsyncBatchHandle, RemoteHandleSettings
from wax._private.api.rules import error_of_wax, hived_rules
from wax.interfaces import ApiCollectionT

if TYPE_CHECKING:
    from hiveio_api.client import ExpectResultT, JSONRPCResult, Methods

    from beekeepy.communication import AsyncCallbacks, ResponseCallback
    from beekeepy.exceptions import OverseerError
    from beekeepy.handle.remote import AsyncSendable
    from beekeepy.interfaces import HttpUrl

CollectionT = TypeVar("CollectionT")


def api_collection_factory(template: type[CollectionT], owner: AsyncSendable) -> CollectionT:
    """
    Create the API collection of the given type (template) - with instances of its APIs owned by the owner.

    APIs are declared by `_API_MAP` of collection classes (maps of collections joined by `extends` are merged) and by
    API classes assigned to the collection in its `__init__` (as in the example of `extends`). Later declarations take
    precedence, so an extension can replace an API of the same name.
    """
    collection = template()
    if isinstance(collection, AbstractAsyncApiCollection):
        # collections of wax are templates created without arguments (also by `extends`) - the owner is given here
        AbstractAsyncApiCollection.__init__(collection, owner)

    apis: dict[str, type] = {}
    for cls in reversed(template.__mro__):
        apis.update(vars(cls).get("_API_MAP", {}))
    apis.update(
        (name, value) for name, value in vars(collection).items() if not name.startswith("_") and _is_api(value)
    )
    for api_name, api in apis.items():
        setattr(collection, api_name, api(owner=owner))

    return collection


def _is_api(value: object) -> TypeGuard[type[AbstractAsyncApi]]:
    return isinstance(value, type) and issubclass(value, AbstractAsyncApi)


class WaxBatchHandle(AsyncBatchHandle[CollectionT]):
    """
    Batch of requests of a caller - errors are raised as errors of wax, as errors of single requests.

    The error of a request is raised when the batch is sent or, with `delay_error_on_data_access`, when its result is
    read. Errors of the whole batch (e.g. of sending it) are raised when it is sent.
    """

    def _error_of_request(self, error: OverseerError) -> BaseException:
        return error_of_wax(error)

    async def _ahandle_no_exception(self) -> None:
        try:
            await super()._ahandle_no_exception()
        except CommunicationError as error:
            raise error_of_wax(error) from error


class WaxApiCaller(AbstractAsyncHandle[RemoteHandleSettings, ApiCollectionT]):  # type: ignore[type-var]
    _INSTANCES: ClassVar[set[WaxApiCaller[Any]]] = set()

    def __init__(self, api_collection: type[ApiCollectionT], endpoint_url: HttpUrl) -> None:
        """
        Create the caller sending requests to the endpoint.

        Args:
            api_collection: type of the API collection of the caller (`api`) - created by `api_collection_factory`.
            endpoint_url: address of the node.
        """
        self._api_collection = api_collection  # assigned here because `_construct_api` method
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

    def create_api(self, template: type[CollectionT]) -> CollectionT:
        """
        API collection of the given type, sending requests through this caller.

        Responses are checked by rules of the caller. Errors of requests are raised as errors of wax by the caller,
        after callbacks of errors.
        """
        api = api_collection_factory(template, self)
        assert isinstance(api, AbstractAsyncApiCollection), "API collections of wax derive from WaxApiCollection"
        self._with_rules(api)
        return api

    def _rules(self) -> list[ResponseCallback]:
        return hived_rules()

    async def _async_send(
        self,
        *,
        method: Methods,
        expected_type: type[ExpectResultT],
        data: str | None = None,
        url: HttpUrl | None = None,
        callbacks: AsyncCallbacks | None = None,
    ) -> JSONRPCResult[ExpectResultT]:
        """Send the request - its errors (detected by rules or of sending) are raised as errors of wax."""
        try:
            return await super()._async_send(
                method=method, expected_type=expected_type, data=data, url=url, callbacks=callbacks
            )
        except CommunicationError as error:
            raise error_of_wax(error) from error

    async def batch(self, *, delay_error_on_data_access: bool = False) -> WaxBatchHandle[ApiCollectionT]:
        """Batch of requests with the API collection of the caller - errors are raised as errors of wax."""
        return WaxBatchHandle(
            url=self.http_endpoint,
            owner=self,
            api=partial(api_collection_factory, self._api_collection),
            delay_error_on_data_access=delay_error_on_data_access,
        )

    def _construct_api(self) -> ApiCollectionT:
        return self.create_api(self._api_collection)

    def _target_service(self) -> str:
        return "wax_api_caller"

    def teardown(self) -> None:
        try:
            super().teardown()
        finally:
            self._INSTANCES.discard(self)

    async def async_teardown(self) -> None:
        try:
            await super().async_teardown()
        finally:
            self._INSTANCES.discard(self)


def _cleanup_instances() -> None:
    """Cleanup all WaxApiCaller instances before interpreter shutdown."""
    for instance in tuple(WaxApiCaller._INSTANCES):
        instance.teardown()

    WaxApiCaller._INSTANCES.clear()


atexit.register(_cleanup_instances)
