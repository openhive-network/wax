from __future__ import annotations

from copy import deepcopy
from typing import TYPE_CHECKING, Callable, Final

from typing_extensions import Self

from wax._private.core.not_yet_initialized import NotYetInitialized
from wax.complex_operations.role_classes.level_base import LevelBase, TRole
from wax.exceptions import InvalidAccountOrKeyError

if TYPE_CHECKING:
    from wax.models.authority import WaxAuthority
    from wax.models.basic import AccountName, PublicKey


DEFAULT_ACCOUNT_OR_KEY_WEIGHT: Final[int] = 1


class HiveRoleAuthorityDefinition(LevelBase[TRole]):
    """
    Hive role authority definition.

    Attributes:
        hive_max_account_length (int): Maximum account name length.
        hive_address_prefix (str): Hive address prefix.
        authority (WaxAuthority): Current authority.
        previous_authority (WaxAuthority): Previous authority.

    Notice:
        All above attributes are initialized after calling the `init` method.
        If you try to access them before calling the `init` method, an assertion will be raised.
    """

    def __init__(
        self,
        level: TRole,
        ensure_can_update: Callable[[TRole], None] = lambda level: None,  # noqa: ARG005
    ) -> None:
        super().__init__(level)
        self.ensure_can_update = ensure_can_update

        self._HIVE_MAX_ACCOUNT_NAME_LENGTH: int | NotYetInitialized = NotYetInitialized()
        self._HIVE_ADDRESS_PREFIX: str | NotYetInitialized = NotYetInitialized()
        self._authority: WaxAuthority | NotYetInitialized = NotYetInitialized()
        self._previous_authority: WaxAuthority | NotYetInitialized = NotYetInitialized()
        self._enforced_modifications: bool = False

    def init(
        self,
        max_account_name_length: int,
        hive_address_prefix: str,
        authority: WaxAuthority,
    ) -> None:
        self._HIVE_MAX_ACCOUNT_NAME_LENGTH = max_account_name_length
        self._HIVE_ADDRESS_PREFIX = hive_address_prefix
        self._authority = authority
        self._previous_authority = deepcopy(authority)
        self._enforced_modifications = False

    @property
    def changed(self) -> bool:
        """Checks if the authority has changed since the last update."""
        if self._enforced_modifications or (
            self.previous_authority.weight_threshold != self.authority.weight_threshold
        ):
            return True

        account_keys = self.authority.account_auths.keys()
        previous_account_keys = self.previous_authority.account_auths.keys()

        if len(account_keys) != len(previous_account_keys):
            return True

        for new, old in zip(account_keys, previous_account_keys):
            if new != old or self.authority.account_auths.get(new) != self.previous_authority.account_auths.get(old):
                return True

        key_keys = self.authority.key_auths.keys()
        previous_key_keys = self.previous_authority.key_auths.keys()

        if len(key_keys) != len(previous_key_keys):
            return True

        for new, old in zip(key_keys, previous_key_keys):
            if new != old or self.authority.key_auths.get(new) != self.previous_authority.key_auths.get(old):
                return True

        return False

    def enforce_modifications(self) -> None:
        self._enforced_modifications = True

    @property
    def value(self) -> WaxAuthority:
        return self.authority

    @property
    def authority(self) -> WaxAuthority:
        return NotYetInitialized.ensure_is_attribute_initialized(self._authority)

    @property
    def previous_authority(self) -> WaxAuthority:
        return NotYetInitialized.ensure_is_attribute_initialized(self._previous_authority)

    @property
    def hive_max_account_length(self) -> int:
        return NotYetInitialized.ensure_is_attribute_initialized(self._HIVE_MAX_ACCOUNT_NAME_LENGTH)

    @property
    def hive_address_prefix(self) -> str:
        return NotYetInitialized.ensure_is_attribute_initialized(self._HIVE_ADDRESS_PREFIX)

    @property
    def is_null_authority(self) -> bool:
        """
        Checks if the currently selected role is null - everyone can access your account. No account, key is added.

        Returns:
            bool: True if the currently selected role is null.
        """
        return not self.authority.key_auths.keys() and not self.authority.account_auths.keys()

    def add(self, account_or_key: PublicKey | AccountName, weight: int = DEFAULT_ACCOUNT_OR_KEY_WEIGHT) -> Self:
        """
        Adds an account or key to the currently selected role with specified weight.

        Notes:
            If the account or key already exists, its weight is updated.

        Args:
            account_or_key: Account or key to be added to the currently selected role.
            weight: Account or key weight in the authority. Default is 1.

        Returns:
            Self: itself.

        Raises:
            InvalidAccountOrKeyError: If the account or key is invalid.
        """
        self.ensure_can_update(self.level)
        self._add_to_role(account_or_key, weight)
        return self

    def replace(
        self,
        account_or_key: PublicKey | AccountName,
        weight: int,
        new_account_or_key: PublicKey | AccountName | None = None,
    ) -> Self:
        """
        Replaces an account or key in the currently selected role or changes the weight of the existing account or key.

        Args:
            account_or_key: Account or key to be replaced.
            weight: Account or key weight.
            new_account_or_key: New account or key to replace the old one. If not provided,
                                the account or key is not replaced, but weight is changed.

        Returns:
            Self: itself.

        Raises:
            InvalidAccountOrKeyError: If the account or key is invalid.
        """
        self.ensure_can_update(self.level)

        if new_account_or_key is None:
            new_account_or_key = account_or_key

        if account_or_key != new_account_or_key:
            self._ensure_valid_account_or_key(new_account_or_key)
            self._remove_from_role(account_or_key)

        self._add_to_role(new_account_or_key, weight)
        return self

    def remove(self, account_or_key: PublicKey | AccountName) -> Self:
        """
        Remove given account or key from the currently selected role.

        Args:
            account_or_key: Account or key to be removed from the currently selected role.

        Returns:
            Self: itself.

        Raises:
            InvalidAccountOrKeyError: If the account or key is invalid.
        """
        self.ensure_can_update(self.level)
        self._remove_from_role(account_or_key)
        return self

    def reset(self) -> None:
        self._authority = deepcopy(self.previous_authority)
        self._enforced_modifications = False

    def has(self, account_or_key: PublicKey | AccountName, weight: int | None = None) -> bool:
        """
        Checks if the account or key is present in the currently selected role.

        Args:
            account_or_key: Account or key to be checked.
            weight: Account or key weight in the authority. If provided - is checked as well.

        Returns:
            bool: True if the account or key is present in the currently selected role.
        """
        as_tuple = self._get_tuple(account_or_key)

        if weight and as_tuple:
            return as_tuple[1] == weight
        return bool(as_tuple)

    def set_threshold(self, threshold: int = DEFAULT_ACCOUNT_OR_KEY_WEIGHT) -> Self:
        """
        Set the weight threshold for the currently selected role.

        Args:
            threshold: Weight threshold for the currently selected role.

        Returns:
            Self: itself.

        Raises:
            AssertionError: If the role is not initialized.

        """
        self.ensure_can_update(self.level)
        self.authority.weight_threshold = threshold
        return self

    def clear(self) -> Self:
        """Clears the currently selected role."""
        self.ensure_can_update(self.level)

        self.authority.key_auths.clear()
        self.authority.account_auths.clear()
        self.authority.weight_threshold = DEFAULT_ACCOUNT_OR_KEY_WEIGHT

        return self

    def _add_to_role(self, account_or_key: PublicKey | AccountName, weight: int) -> None:
        if self._is_public_key(account_or_key):
            self.authority.key_auths[account_or_key] = weight
            return

        if self._is_account_name(account_or_key):
            self.authority.account_auths[account_or_key] = weight
            return

        raise InvalidAccountOrKeyError(account_or_key)

    def _remove_from_role(self, account_or_key: PublicKey | AccountName) -> None:
        if self._is_public_key(account_or_key):
            self.authority.key_auths.pop(account_or_key)
            return

        if self._is_account_name(account_or_key):
            self.authority.account_auths.pop(account_or_key)
            return

        raise InvalidAccountOrKeyError(account_or_key)

    def _ensure_valid_account_or_key(self, account_or_key: PublicKey | AccountName) -> None:
        if not self._is_public_key(account_or_key) and not self._is_account_name(account_or_key):
            raise InvalidAccountOrKeyError(account_or_key)

    def _get_tuple(self, account_or_key: PublicKey | AccountName) -> tuple[PublicKey | AccountName, int] | None:
        if self._is_public_key(account_or_key) and (threshold := self.authority.key_auths.get(account_or_key)):
            return account_or_key, threshold

        if self._is_account_name(account_or_key) and (threshold := self.authority.account_auths.get(account_or_key)):
            return account_or_key, threshold

        return None

    def _is_public_key(self, account_or_key: PublicKey | AccountName) -> bool:
        return account_or_key.startswith(self.hive_address_prefix)

    def _is_account_name(self, account_or_key: PublicKey | AccountName) -> bool:
        return len(account_or_key) <= self.hive_max_account_length
