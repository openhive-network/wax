from __future__ import annotations

import time
from typing import TYPE_CHECKING, Final, Generic, cast

from wax._private.api.api_caller import WaxApiCaller
from wax._private.api.models import ApiTransaction
from wax._private.base_api import WaxBaseApi
from wax._private.converters.url_converter import convert_to_http_url
from wax._private.models.hive_date_time import HiveDateTime
from wax._private.online_transaction import OnlineTransaction
from wax.api.collection import WaxApiCollection
from wax.exceptions.chain_errors import AccountNotFoundError
from wax.exceptions.validation_errors import InvalidAccountNameError
from wax.interfaces import ApiCollectionT, ExtendedApiCollectionT, IHiveChainInterface, IOnlineTransaction
from wax.models.authority import WaxAccountAuthorityInfo, WaxAuthorities, WaxAuthority
from wax.models.basic import ChainReferenceData

if TYPE_CHECKING:
    from datetime import datetime, timedelta

    from beekeepy.interfaces import HttpUrl
    from wax._private.api.models import FindAccountsApiResponse, PossibleAuthorityApi
    from wax.interfaces import ITransaction
    from wax.models.basic import AccountName, ChainId


class HiveChainApi(IHiveChainInterface, WaxBaseApi, Generic[ApiCollectionT]):
    TAPOS_LIVENESS: Final[int] = 3000  # 3 seconds / 3000 milliseconds

    def __init__(
        self,
        chain_id: ChainId,
        endpoint_url: HttpUrl,
        api_collection: type[ApiCollectionT] | None = None,
        *,
        _private: bool = False,
    ) -> None:
        """
        Initializes HiveChainApi.

        Args:
            chain_id: chain id of the node passed by `node_address`.
            endpoint_url: address of the node to connect to.
            api_collection: type of the api collection to use. Defaults to WaxApiCollection.
            _private: flag indicating that the constructor should not be called directly.

        Raises:
            AssertionError: if the constructor is called directly.
        """
        assert _private, "HiveChainApi should not be instantiated directly. Use create_hive_chain() instead."
        super().__init__(chain_id, _private=True)
        self._chain_id = chain_id
        self._endpoint_url = endpoint_url

        if api_collection is None:
            api_collection = WaxApiCollection  # type: ignore[assignment]  # ApiCollectionT can be WaxApiCollection

        assert api_collection is not None, "api_collection must be provided or default to WaxApiCollection."
        self._api_collection = api_collection
        self._api_caller = WaxApiCaller(api_collection(), endpoint_url)

        self._last_tapos_cache_update = 0
        self._tapos_cache = ChainReferenceData(time=HiveDateTime.now())

    @property
    def api(self) -> ApiCollectionT:  # type: ignore[override]
        return self._api_caller.api

    def extends(self, new_api: type[ExtendedApiCollectionT]) -> HiveChainApi[ExtendedApiCollectionT | ApiCollectionT]:  # type: ignore[override]
        current_api: type[ApiCollectionT | ExtendedApiCollectionT] = self._api_collection

        class NewApi(new_api, current_api):  # type: ignore[valid-type, misc]
            def __init__(self) -> None:
                new_api.__init__(self)
                current_api.__init__(self)
                # super().__init__() is not used here as it requires the user to call the super() method also,
                # which causes that it is required when some collection has not base class

        return HiveChainApi[ExtendedApiCollectionT | ApiCollectionT](
            self.chain_id, self.endpoint_url, NewApi, _private=True
        )

    @property
    def endpoint_url(self) -> HttpUrl:
        return self._endpoint_url

    @endpoint_url.setter
    def endpoint_url(self, value: HttpUrl | str) -> None:
        parsed_endpoint_url = convert_to_http_url(value)

        self._endpoint_url = parsed_endpoint_url
        self._api_caller.set_endpoint_url(parsed_endpoint_url, _private=True)

    def teardown(self) -> None:
        """Call when work with communicator is over."""
        self._api_caller.teardown()

    async def create_transaction(self, expiration: datetime | timedelta | None = None) -> IOnlineTransaction:
        chain_reference_data = await self._acquire_chain_reference_data()
        expiration = self._resolve_expiration(expiration)
        return OnlineTransaction(self, chain_reference_data, expiration)  # type: ignore[arg-type]

    async def broadcast(self, transaction: ITransaction | IOnlineTransaction) -> None:
        if isinstance(transaction, IOnlineTransaction):
            await transaction.perform_on_chain_verification()

        await self._internal_api.network_broadcast_api.broadcast_transaction(
            trx=ApiTransaction(**transaction.to_dict()), max_block_age=-1
        )

    async def collect_account_authorities(
        self, *accounts: AccountName
    ) -> WaxAccountAuthorityInfo | list[WaxAccountAuthorityInfo]:
        for account in accounts:
            if not self.is_valid_account_name(account):
                raise InvalidAccountNameError(account)

        accounts_response = await self._internal_api.database_api.find_accounts(accounts=[*accounts])

        if len(accounts) == 1:
            return self._extract_authority_from_find_accounts_response(accounts_response, accounts[0])[0]

        return self._extract_authority_from_find_accounts_response(accounts_response, *accounts)

    def extend_rest(  # type: ignore[override]
        self, new_rest_api: type[ExtendedApiCollectionT]
    ) -> HiveChainApi[ExtendedApiCollectionT | ApiCollectionT]:
        return self.extends(new_rest_api)

    @property
    def _internal_api(self) -> WaxApiCollection:
        return cast(WaxApiCollection, self._api_caller.api)

    async def _acquire_chain_reference_data(self) -> ChainReferenceData:
        now = self._current_milli_time()

        if now - self._last_tapos_cache_update > self.TAPOS_LIVENESS:
            dgpo = await self._internal_api.database_api.get_dynamic_global_properties()
            self._tapos_cache = ChainReferenceData(
                head_block_id=dgpo.head_block_id,
                time=HiveDateTime(dgpo.time),
            )
            self._last_tapos_cache_update = now

        return self._tapos_cache

    def _transform_api_authority(self, api_authority: PossibleAuthorityApi) -> WaxAuthority | None:
        if not api_authority:
            return None

        entity_index: Final[int] = 0
        weight_index: Final[int] = 1

        return WaxAuthority(
            weight_threshold=api_authority.weight_threshold,
            account_auths={account[entity_index]: account[weight_index] for account in api_authority.account_auths},
            key_auths={key[entity_index]: cast(int, key[weight_index]) for key in api_authority.key_auths},
        )

    def _extract_authority_from_find_accounts_response(
        self,
        response: FindAccountsApiResponse,
        *searched_accounts: AccountName,
    ) -> list[WaxAccountAuthorityInfo]:
        if not response.accounts:
            raise AccountNotFoundError(*searched_accounts)

        accounts_to_search = set(searched_accounts)
        accounts_data = []

        for account in response.accounts:
            if account.name in searched_accounts:
                accounts_data.append(account)
                accounts_to_search.remove(account.name)

                if not accounts_to_search:
                    break

        if not accounts_data:
            raise AccountNotFoundError(*accounts_to_search)

        return [
            WaxAccountAuthorityInfo(
                account_data.name,
                WaxAuthorities(
                    owner=self._transform_api_authority(account_data.owner),
                    active=self._transform_api_authority(account_data.active),
                    posting=self._transform_api_authority(account_data.posting),
                ),
                account_data.memo_key,
                HiveDateTime(account_data.last_owner_update),
                HiveDateTime(account_data.previous_owner_update),
            )
            for account_data in accounts_data
        ]

    def _current_milli_time(self) -> int:
        return round(time.time() * 1000)
