from __future__ import annotations

from typing import TYPE_CHECKING

from wax.interfaces import IAuthorityDataProvider

if TYPE_CHECKING:
    from wax import IHiveChainInterface
    from wax.models.authority import WaxAccountAuthorityInfo
    from wax.models.basic import AccountName


class OnlineChainAuthorityDataProvider(IAuthorityDataProvider):
    def __init__(self, chain_api: IHiveChainInterface) -> None:
        """
        Online version of authority data provider which does call to api.

        Args:
            chain_api (IHiveChainInterface): the instance used to perform the api call.
        """
        self._chain_api = chain_api

    async def get_hive_authority_data(self, account: AccountName) -> WaxAccountAuthorityInfo:
        """
        Get AuthorityAccount from account name.

        Args:
            account(AccountName): name of account that will be passed to api call.

        Raises:
            AccountNotFoundError: When account with given name was not found.

        Returns:
            Object that holds authority data.
        """
        authorities = await self._chain_api.collect_account_authorities(account)
        assert not isinstance(authorities, list), f"Found multiple authorities for the {account} account."
        return authorities
