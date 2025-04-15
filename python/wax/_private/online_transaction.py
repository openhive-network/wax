from __future__ import annotations

from typing import TYPE_CHECKING

from wax._private.core.constants import DEFAULT_TRANSACTION_EXPIRATION_TIME
from wax._private.transaction import Transaction
from wax.interfaces import ApiCollectionT, IOnlineTransaction
from wax.wax_options import WaxOptions

if TYPE_CHECKING:
    from datetime import timedelta

    from wax._private.chain_api import HiveChainApi
    from wax.models.basic import ChainReferenceData


class OnlineTransaction(Transaction, IOnlineTransaction):
    def __init__(
        self,
        chain_api: HiveChainApi[ApiCollectionT],
        chain_reference_data: ChainReferenceData,
        expiration_time: timedelta = DEFAULT_TRANSACTION_EXPIRATION_TIME,
    ) -> None:
        expiration_ref_time = chain_reference_data.time if chain_api.chain_id != WaxOptions().chain_id else None
        """
        We're using head block time as a expiration reference time for other chains than mainnet.
        For mainnet is best to eliminate potential API node time screw.
        For other (testing) chains it simplifies APPs rapid prototyping on deployments being mirrornet specific.
        """
        super().__init__(chain_api, chain_reference_data.head_block_id, expiration_time, expiration_ref_time)
