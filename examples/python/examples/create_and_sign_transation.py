from __future__ import annotations

import os
import asyncio

from beekeepy import AsyncBeekeeper, AsyncUnlockedWallet
from wax import IOnlineTransaction, WaxChainOptions, create_hive_chain
from wax.proto.operations import transfer

PASSWORD = os.getenv("WALLET_PASSWORD", "password")
WALLET_NAME = os.getenv("WALLET_NAME", "my_wallet")
HIVED_ADDRESS = os.getenv("HIVED_ADDRESS", "https://api.hive.blog")
PRIVATE_KEY = os.getenv("PRIVATE_KEY", "")
PUBLIC_KEY = os.getenv("PUBLIC_KEY", "")
ACCOUNT_NAME = os.getenv("ACCOUNT_NAME", "")
TRANSFER_RECEIVER = os.getenv("TRANSFER_RECEIVER", "")

wax = create_hive_chain(WaxChainOptions(endpoint_url=HIVED_ADDRESS))

# Create a transaction with automatic acquire the required chain id
async def create_tx() -> IOnlineTransaction:
    tx = await wax.create_transaction()
    tx.push_operation(
        transfer(
            from_account=ACCOUNT_NAME,
            to_account=TRANSFER_RECEIVER,
            amount=wax.hive.satoshis(1),
            memo="hello from wax!",
        )
    )
    return tx


# Sign the transaction with the passed wallet
async def sign_tx(unlocked_wallet: AsyncUnlockedWallet, tx: IOnlineTransaction) -> IOnlineTransaction:
    if PUBLIC_KEY not in await unlocked_wallet.public_keys:
        await unlocked_wallet.import_key(private_key=PRIVATE_KEY)

    await tx.sign(wallet=unlocked_wallet, public_key=PUBLIC_KEY)
    return tx


async def main() -> None:
    tx = await create_tx()

    # Create beekeeper instance, wallet and session, then sign the transaction
    async with await AsyncBeekeeper.factory() as beekeeper:
        session = await beekeeper.create_session(salt="")
        wallet = await session.create_wallet(name=WALLET_NAME, password=PASSWORD)
        await sign_tx(wallet, tx)
        await wax.broadcast(tx)

asyncio.run(main())
