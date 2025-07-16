from wax.exceptions.chain_errors import AccountNotFoundError
from wax.interfaces import IAuthorityDataProvider, IHiveChainInterface
from wax.models.authority import AuthorityAccount
from wax.models.basic import AccountName


class OnlineChainAuthorityDataProvider(IAuthorityDataProvider):
    def __init__(self, chain_api: IHiveChainInterface) -> None:
        """
        Online version of authority data provider which does call to api.

        Args:
            chain_api (IHiveChainInterface): the instance used to perform the api call.
        """
        self._chain_api = chain_api

    async def get(self, name: AccountName) -> AuthorityAccount:
        """
        Get AuthorityAccount from account name.

        Args:
            name (AccountName): name of account that will be passed to api call.

        Raises:
            AccountNotFoundError: When account with given name was not found.

        Returns:
            Object that holds authority data.


        """
        api_accounts = await self._chain_api.api.database_api.find_accounts(accounts=[name])

        for api_account in api_accounts.accounts:
            if api_account.name == name:
                return api_account  # type: ignore[no-any-return]
        raise AccountNotFoundError(name)
