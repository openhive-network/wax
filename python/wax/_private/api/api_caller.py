from __future__ import annotations

from typing import TYPE_CHECKING

from beekeepy import Settings
from beekeepy._handle.abc.handle import AbstractAsyncHandle
from beekeepy._handle.batch_handle import AsyncBatchHandle
from wax._private.api.api_collection import ApiCollection

if TYPE_CHECKING:
    from beekeepy._interface.url import HttpUrl


class WaxApiCaller(AbstractAsyncHandle[ApiCollection]):
    def __init__(self, endpoint_url: HttpUrl) -> None:
        settings = Settings()
        settings.http_endpoint = endpoint_url
        super().__init__(settings=settings)

    def set_endpoint_url(self, endpoint_url: HttpUrl, *, _private: bool = False) -> None:
        assert _private, (
            "Endpoint url should not be set by this method. "
            "Please modify `endpoint_url` property instead in the `HiveChainApi`."
        )
        self.http_endpoint = endpoint_url

    @property
    def api(self) -> ApiCollection:
        return super().api

    def _construct_api(self) -> ApiCollection:
        return ApiCollection(self)

    def _target_service(self) -> str:
        return "hived"

    async def batch(self, *, delay_error_on_data_access: bool = False) -> AsyncBatchHandle[ApiCollection]:
        return AsyncBatchHandle(
            url=self.http_endpoint,
            communicator=self._communicator,
            api=lambda o: ApiCollection(o),
            delay_error_on_data_access=delay_error_on_data_access,
        )
