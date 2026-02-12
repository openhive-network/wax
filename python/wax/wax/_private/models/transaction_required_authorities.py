from __future__ import annotations

from typing import TYPE_CHECKING

from wax.models.authority import ITransactionRequiredAuthorities, WaxAuthority

if TYPE_CHECKING:
    from wax.models.basic import AccountName
    from wax.wax_result import python_authority, python_required_authority_collection


class TransactionRequiredAuthorities(ITransactionRequiredAuthorities):
    def __init__(self, required_authority_collection: python_required_authority_collection) -> None:
        self._posting_accounts: set[AccountName] = required_authority_collection.posting_accounts
        self._active_accounts: set[AccountName] = required_authority_collection.active_accounts
        self._owner_accounts: set[AccountName] = required_authority_collection.owner_accounts
        self._other_authorities: list[WaxAuthority] = self.resolve_other_authorities(
            required_authority_collection.other_authorities
        )

    @property
    def posting_accounts(self) -> set[AccountName]:
        return self._posting_accounts

    @property
    def active_accounts(self) -> set[AccountName]:
        return self._active_accounts

    @property
    def owner_accounts(self) -> set[AccountName]:
        return self._owner_accounts

    @property
    def other_authorities(self) -> list[WaxAuthority]:
        return self._other_authorities

    def resolve_other_authorities(self, other_authorities: list[python_authority]) -> list[WaxAuthority]:
        return [
            WaxAuthority(
                weight_threshold=authority.weight_threshold,
                account_auths=authority.account_auths,
                key_auths=authority.key_auths,
            )
            for authority in other_authorities
        ]
