from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.result_tools import to_python_string
from wax.models.key_data import IPrivateKeyData

if TYPE_CHECKING:
    from wax.wax_result import python_private_key_data


class PrivateKeyData(IPrivateKeyData):
    """
    Class for storing private key data.

    Attributes:
        wif private key: first private key derived from above specified brain key.
        associated public key: base58 string pointing the public key associated to the private key specified above.
    """

    def __init__(self, data: python_private_key_data) -> None:
        """
        Initialize PrivateKeyData.

        Args:
            data: private key data.
        """
        self._wif_private_key = to_python_string(data.wif_private_key)
        self._associated_public_key = to_python_string(data.associated_public_key)

    @property
    def wif_private_key(self) -> str:
        return self._wif_private_key

    @property
    def associated_public_key(self) -> str:
        return self._associated_public_key
