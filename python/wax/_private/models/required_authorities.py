from __future__ import annotations

from typing import TYPE_CHECKING

from schemas.fields.basic import AccountName, PublicKey
from schemas.fields.compound import Authority
from schemas.fields.hive_int import HiveInt
from wax._private.core.encoders import to_python_string

if TYPE_CHECKING:
    from wax.wax_result import python_authority, python_required_authority_collection


class TransactionRequiredAuthorities:
    def __init__(self, required_authority_collection: python_required_authority_collection) -> None:
        self.posting_accounts: set[AccountName] = self._decode_accounts(required_authority_collection.posting_accounts)
        self.active_accounts: set[AccountName] = self._decode_accounts(required_authority_collection.active_accounts)
        self.owner_accounts: set[AccountName] = self._decode_accounts(required_authority_collection.owner_accounts)
        self.other_authorities: list[Authority] = self.resolve_other_authorities(
            required_authority_collection.other_authorities
        )

    def resolve_other_authorities(self, other_authorities: list[python_authority]) -> list[Authority]:
        return [
            Authority(
                weight_threshold=HiveInt(authority.weight_threshold),
                account_auths=self._create_account_auths(authority.account_auths),
                key_auths=self._create_key_auths(authority.key_auths),
            )
            for authority in other_authorities
        ]

    def _decode_accounts(self, accounts: set[bytes]) -> set[AccountName]:
        return {AccountName(to_python_string(account)) for account in accounts}

    def _create_account_auths(self, auth: dict[bytes, int]) -> list[tuple[AccountName, HiveInt]]:
        return [(AccountName(to_python_string(account)), HiveInt(weight)) for account, weight in auth.items()]

    def _create_key_auths(self, auth: dict[bytes, int]) -> list[tuple[PublicKey, HiveInt]]:
        return [(PublicKey(to_python_string(key)), HiveInt(weight)) for key, weight in auth.items()]
