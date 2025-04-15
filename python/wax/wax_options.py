from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.converters.url_converter import convert_to_http_url
from wax._private.core.constants import DEFAULT_CHAIN_ID, DEFAULT_ENDPOINT_URL

if TYPE_CHECKING:
    from beekeepy.interfaces import HttpUrl
    from wax.models.basic import ChainId


class WaxOptions:
    """Allows configuration of wax itself."""

    def __init__(self, chain_id: ChainId = DEFAULT_CHAIN_ID) -> None:
        """
        Constructs WaxOptions.

        Args:
            chain_id: chain id used for signing. Defaults to mainnet chain id.
        """
        self.chain_id = chain_id


class WaxChainOptions(WaxOptions):
    """Allows configuration of wax itself, including chain part."""

    def __init__(
        self,
        chain_id: ChainId | str = DEFAULT_CHAIN_ID,
        endpoint_url: HttpUrl | str = DEFAULT_ENDPOINT_URL,
    ) -> None:
        """
        Constructs WaxChainOptions.

        Args:
            chain_id: chain id used for signing. Defaults to mainnet chain id.
            endpoint_url: url of the node to connect to. Defaults to mainnet (hive.blog) node.

        Raises:
            InvalidEndpointUrlFormatError: if endpoint_url is not valid.
        """
        super().__init__(chain_id)
        self._endpoint_url = convert_to_http_url(endpoint_url)

    @property
    def endpoint_url(self) -> HttpUrl:
        return self._endpoint_url

    @endpoint_url.setter
    def endpoint_url(self, value: HttpUrl | str) -> None:
        """
        Set endpoint url.

        Args:
            value: new endpoint url.

        Raises:
            InvalidEndpointUrlFormatError: if endpoint url is not valid.
        """
        self._endpoint_url = convert_to_http_url(value)
