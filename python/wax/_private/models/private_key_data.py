from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.result_tools import to_python_string

if TYPE_CHECKING:
    from wax.wax_result import python_private_key_data


class PrivateKeyData:
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
        self.wif_private_key = to_python_string(data.wif_private_key)
        self.associated_public_key = to_python_string(data.associated_public_key)
