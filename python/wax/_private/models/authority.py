from __future__ import annotations

from dataclasses import dataclass
from typing import TypeAlias

from wax._private.models.basic import AccountName, PublicKey
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
