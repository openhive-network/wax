from __future__ import annotations

from typing import TYPE_CHECKING

from beekeepy import Settings
from wax.helpy import AsyncHived

if TYPE_CHECKING:
    from beekeepy.interfaces import HttpUrl
    from wax.helpy._handles.hived.api.api_collection import HivedAsyncApiCollection


class WaxApiCaller(AsyncHived):
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
    def api(self) -> HivedAsyncApiCollection:
        return super().api
