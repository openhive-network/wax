from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.core.encoders import to_python_string

if TYPE_CHECKING:
    from wax.wax_result import python_brain_key_data


class BrainKeyData:
    """
    Class for storing brain key data.

    Attributes:
        brain key: a string containing space separated list of N words generated as a brain key (atm 16).
        wif private key: first private key derived from above specified brain key.
        associated public key: base58 string pointing the public key associated to the private key specified above.
    """

    def __init__(self, data: python_brain_key_data) -> None:
        """
        Initialize BrainKeyData.

        Args:
            data: brain key data.
        """
        self.brain_key = to_python_string(data.brain_key)
        self.wif_private_key = to_python_string(data.wif_private_key)
        self.associated_public_key = to_python_string(data.associated_public_key)
