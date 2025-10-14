from __future__ import annotations

from typing import Final

import pytest

from wax import WaxChainOptions, create_hive_chain
from wax.exceptions.chain_errors import PrivateKeyDetectedInMemoError
from wax.proto.operations import transfer

MIRRORNET_SKELETON_KEY: Final[str] = "5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n"
MIRRORNET_NODE_ADDRESS = "https://api.fake.openhive.network/"
MIRRORNET_CHAIN_ID: Final[str] = "4200000000000000000000000000000000000000000000000000000000000000"


async def test_online_transaction_perform_on_chain_verification() -> None:
    # ARRANGE
    remote_chain = create_hive_chain(WaxChainOptions(MIRRORNET_CHAIN_ID, MIRRORNET_NODE_ADDRESS))
    transaction = await remote_chain.create_transaction()
    transfer_op = transfer(
        from_account="otom",
        to_account="otom",
        amount=remote_chain.hive.coins(1),
        memo=MIRRORNET_SKELETON_KEY,
    )

    # ACT & ASSERT
    transaction.push_operation(transfer_op)

    with pytest.raises(PrivateKeyDetectedInMemoError):
        await transaction.perform_on_chain_verification()
