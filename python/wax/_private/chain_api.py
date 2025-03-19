from __future__ import annotations

import time
from typing import TYPE_CHECKING, Final, cast

from wax._private.api.api_caller import WaxApiCaller
from wax._private.base_api import WaxBaseApi
from wax._private.converters.url_converter import convert_to_http_url
from wax._private.models.hive_date_time import HiveDateTime
from wax._private.models.schemas import ApiTransaction
from wax._private.online_transaction import OnlineTransaction
from wax.exceptions.chain_errors import AccountNotFoundError
from wax.exceptions.validation_errors import InvalidAccountNameError
from wax.interfaces import IHiveChainInterface, IOnlineTransaction
from wax.models.authority import WaxAccountAuthorityInfo, WaxAuthorities, WaxAuthority
from wax.models.basic import ChainReferenceData

if TYPE_CHECKING:
    from datetime import datetime, timedelta

    from beekeepy.interfaces import HttpUrl
    from wax._private.api.api_collection import ApiCollection
    from wax._private.models.schemas import ApiAuthority, FindAccountsApiResponse
    from wax.interfaces import ITransaction
    from wax.models.basic import AccountName, ChainId


class HiveChainApi(IHiveChainInterface, WaxBaseApi):
    TAPOS_LIVENESS: Final[int] = 3000  # 3 seconds / 3000 milliseconds

    def __init__(self, chain_id: ChainId, endpoint_url: HttpUrl, *, _private: bool = False) -> None:
        """
        Initializes HiveChainApi.

        Args:
            chain_id: chain id of the node passed by `node_address`.
            endpoint_url: address of the node to connect to.
            _private: flag indicating that the constructor should not be called directly.

        Raises:
            AssertionError: if the constructor is called directly.
        """
        assert _private, "HiveChainApi should not be instantiated directly. Use create_hive_chain() instead."
        super().__init__(chain_id, _private=True)
        self._chain_id = chain_id
        self._endpoint_url = endpoint_url
        self._api_caller = WaxApiCaller(endpoint_url)

        self._last_tapos_cache_update = 0
        self._tapos_cache = ChainReferenceData(time=HiveDateTime.now())

    @property
    def endpoint_url(self) -> HttpUrl:
        return self._endpoint_url

    @endpoint_url.setter
    def endpoint_url(self, value: HttpUrl | str) -> None:
        parsed_endpoint_url = convert_to_http_url(value)

        self._endpoint_url = parsed_endpoint_url
        self._api_caller.set_endpoint_url(parsed_endpoint_url, _private=True)

    @property
    def api(self) -> ApiCollection:
        return self._api_caller.api

    async def create_transaction(self, expiration: datetime | timedelta | None = None) -> IOnlineTransaction:
        chain_reference_data = await self._acquire_chain_reference_data()
        expiration = self._resolve_expiration(expiration)
        return OnlineTransaction(self, chain_reference_data, expiration)

    async def broadcast(self, transaction: ITransaction) -> None:
        await self.api.network_broadcast.broadcast_transaction(trx=ApiTransaction(**transaction.to_dict()))

    async def collect_account_authorities(self, account: AccountName) -> WaxAccountAuthorityInfo:
        if not self.is_valid_account_name(account):
            raise InvalidAccountNameError(account)

        account_response = await self.api.database_api.find_accounts(accounts=[account])
        return self._extract_authority_from_find_accounts_response(account_response, account)

    async def _acquire_chain_reference_data(self) -> ChainReferenceData:
        now = self._current_milli_time()

        if now - self._last_tapos_cache_update > self.TAPOS_LIVENESS:
            dgpo = await self.api.database_api.get_dynamic_global_properties()
            self._tapos_cache = ChainReferenceData(
                head_block_id=dgpo.head_block_id,
                time=cast(HiveDateTime, dgpo.time),
            )
            self._last_tapos_cache_update = now

        return self._tapos_cache

    def _transform_api_authority(self, api_authority: ApiAuthority) -> WaxAuthority | None:
        if not api_authority:
            return None

        entity_index: Final[int] = 0
        weight_index: Final[int] = 1

        return WaxAuthority(
            weight_threshold=api_authority.weight_threshold,
            account_auths={
                cast(str, account[entity_index]): cast(int, account[weight_index])
                for account in api_authority.account_auths
            },
            key_auths={cast(str, key[entity_index]): cast(int, key[weight_index]) for key in api_authority.key_auths},
        )

    def _extract_authority_from_find_accounts_response(
        self,
        response: FindAccountsApiResponse,
        searched_account: AccountName,
    ) -> WaxAccountAuthorityInfo:
        if not response.accounts:
            raise AccountNotFoundError(searched_account)

        account_data = None
        for account in response.accounts:
            if account.name == searched_account:
                account_data = account
                break

        if account_data is None:
            raise AccountNotFoundError(searched_account)

        return WaxAccountAuthorityInfo(
            account_data.name,
            WaxAuthorities(
                owner=self._transform_api_authority(account_data.owner),
                active=self._transform_api_authority(account_data.active),
                posting=self._transform_api_authority(account_data.posting),
            ),
            account_data.memo_key,
        )

    def _current_milli_time(self) -> int:
        return round(time.time() * 1000)
