from __future__ import annotations

from typing import TYPE_CHECKING, Final, Literal

from typing_extensions import Self

from wax._private.core.not_yet_initialized import NotYetInitialized
from wax.complex_operations.role_classes.level_base import LevelBase
from wax.exceptions import InvalidMemoKeyError

if TYPE_CHECKING:
    from wax.models.basic import PublicKey


MemoKeyRoleName = Literal["memo"]
"""Memo key role name."""


class HiveRoleMemoKeyDefinition(LevelBase[MemoKeyRoleName]):
    """
    Hive role memo key definition.

    Attributes:
        hive_address_prefix (str): Hive address prefix.
        public_key (PublicKey): Current public key.
        previous_public_key (PublicKey): Previous public key.

    Notice:
        All above attributes are initialized after calling the `init` method.
        If you try to access them before calling the `init` method, an assertion will be raised.
    """

    _NULL_PUBLIC_KEY: Final[str] = "STM1111111111111111111111111111111114T1Anm"

    def __init__(self) -> None:
        super().__init__("memo")
        self._HIVE_ADDRESS_PREFIX: str | NotYetInitialized = NotYetInitialized()

        self._public_key: PublicKey | NotYetInitialized = NotYetInitialized()
        self._previous_public_key: PublicKey | NotYetInitialized = NotYetInitialized()
        self._enforced_modifications = False

    def init(self, hive_address_prefix: str, public_key: PublicKey) -> None:
        self._HIVE_ADDRESS_PREFIX = hive_address_prefix
        self._public_key = public_key
        self._previous_public_key = public_key
        self._enforced_modifications = False

    def enforce_modifications(self) -> None:
        self._enforced_modifications = True

    @property
    def value(self) -> PublicKey:
        return self.public_key

    @property
    def changed(self) -> bool:
        """Checks if the key has changed since the last update."""
        return self._enforced_modifications or self.public_key != self.previous_public_key

    @property
    def is_set(self) -> bool:
        """Check if the memo key is set to the default value - null public key."""
        return self.public_key != self._NULL_PUBLIC_KEY

    @property
    def public_key(self) -> PublicKey:
        return NotYetInitialized.ensure_is_attribute_initialized(self._public_key)

    @property
    def previous_public_key(self) -> PublicKey:
        return NotYetInitialized.ensure_is_attribute_initialized(self._previous_public_key)

    @property
    def hive_address_prefix(self) -> str:
        return NotYetInitialized.ensure_is_attribute_initialized(self._HIVE_ADDRESS_PREFIX)

    def reset(self) -> None:
        self._public_key = self.previous_public_key
        self._enforced_modifications = False

    def set(self, public_key: PublicKey) -> Self:
        """
        Sets the provided public key as the account memo key.

        Args:
            public_key (PublicKey): Public key to set.

        Returns:
            Self: Role instance.

        Raises:
            InvalidMemoKeyError: If the provided public key is invalid.
        """
        if not self._is_public_key_valid(public_key):
            raise InvalidMemoKeyError(public_key)

        self._public_key = public_key
        return self

    def _is_public_key_valid(self, public_key: PublicKey) -> bool:
        return public_key.startswith(self.hive_address_prefix)
