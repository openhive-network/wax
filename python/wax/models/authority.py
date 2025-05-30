from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TypeAlias

from wax.models.basic import AccountName, PublicKey
from wax.proto.authority import authority as proto_authority

WaxAuthority: TypeAlias = proto_authority
"""Type alias for one of the authorities used in wax."""
KeyAuths: TypeAlias = dict[PublicKey, int]
"""KeyAuths is a type alias for a dictionary mapping public keys to their weight in the authority structure."""
AccountAuths: TypeAlias = dict[AccountName, int]
"""AccountAuths is a type alias for a dictionary mapping account names to their weight in the authority structure."""


@dataclass
class WaxAuthorities:
    """Represents the authorities available when using wax."""

    owner: WaxAuthority | None = None
    active: WaxAuthority | None = None
    posting: WaxAuthority | None = None


@dataclass
class WaxAccountAuthorityInfo:
    """Represents the authority information for an account."""

    account: AccountName
    authorities: WaxAuthorities
    memo_key: PublicKey


class ITransactionRequiredAuthorities(ABC):
    """Interface for transaction required authorities."""

    @property
    @abstractmethod
    def posting_accounts(self) -> set[AccountName]:
        """Get required posting accounts."""

    @property
    @abstractmethod
    def active_accounts(self) -> set[AccountName]:
        """Get required active accounts."""

    @property
    @abstractmethod
    def owner_accounts(self) -> set[AccountName]:
        """Get required owner accounts."""

    @property
    @abstractmethod
    def other_authorities(self) -> list[WaxAuthority]:
        """Get required other authorities."""
