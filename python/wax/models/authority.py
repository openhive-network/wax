from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TYPE_CHECKING, TypeAlias

from wax.models.basic import AccountName, PublicKey
from wax.proto.authority import authority as proto_authority
from wax.wax_result import python_authorities, python_authority

if TYPE_CHECKING:
    from wax._private.models.hive_date_time import HiveDateTime

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

    @staticmethod
    def to_python_authorities(auths: WaxAuthorities) -> python_authorities:
        return python_authorities(
            owner=WaxAuthorities.to_python_authority(auths.owner),
            active=WaxAuthorities.to_python_authority(auths.active),
            posting=WaxAuthorities.to_python_authority(auths.posting),
        )

    @staticmethod
    def to_python_authority(auth: WaxAuthority | None) -> python_authority:
        if auth is None:
            return python_authority(weight_threshold=1, account_auths={}, key_auths={})

        return python_authority(
            weight_threshold=auth.weight_threshold,
            account_auths={account.encode(): weight for account, weight in auth.account_auths.items()},
            key_auths={key.encode(): weight for key, weight in auth.key_auths.items()},
        )


@dataclass
class WaxAccountAuthorityInfo:
    """Represents the authority information for an account."""

    account: AccountName
    authorities: WaxAuthorities
    memo_key: PublicKey
    last_owner_update: HiveDateTime
    previous_owner_update: HiveDateTime


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
