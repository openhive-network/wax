from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TypeAlias

from wax.models.basic import AccountName, PublicKey
from wax.proto.authority_pb2 import authority as proto_authority

WaxAuthority: TypeAlias = proto_authority
KeyAuths: TypeAlias = dict[PublicKey, int]
AccountAuths: TypeAlias = dict[AccountName, int]


@dataclass
class WaxAuthorities:
    owner: WaxAuthority | None = None
    active: WaxAuthority | None = None
    posting: WaxAuthority | None = None


@dataclass
class WaxAccountAuthorityInfo:
    account: AccountName
    authorities: WaxAuthorities
    memo_key: PublicKey


class ITransactionRequiredAuthorities(ABC):
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
