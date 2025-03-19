from __future__ import annotations

import asyncio

from beekeepy import AsyncBeekeeper, AsyncSession, AsyncUnlockedWallet, AsyncWallet, Beekeeper
from wax import IOnlineTransaction, WaxChainOptions, create_hive_chain
from wax.cpp_python_bridge import calculate_public_key
from wax.proto.operations import transfer

PASSWORD = "pass"
WALLET_NAME = "alice"
HIVED_ADDRESS = "https://api.hive.blog"
YOUR_ACCOUNT_NAME = ""
TRANSFER_RECEIVER = ""
YOUR_PRIVATE_KEY = ""
YOUR_PUBLIC_KEY = ""

wax = create_hive_chain(WaxChainOptions(endpoint_url=HIVED_ADDRESS))

async def create_beekeeper_set() -> tuple[AsyncWallet | AsyncUnlockedWallet, AsyncSession, Beekeeper]:
    beekeeper = await AsyncBeekeeper.factory()
    session = await beekeeper.create_session()

    wallet = await session.create_wallet(name=WALLET_NAME, password=PASSWORD) \
        if WALLET_NAME not in [w.name for w in await session.wallets_created] \
        else await session.open_wallet(name=WALLET_NAME)

    return wallet, session, beekeeper

async def create_tx() -> IOnlineTransaction:
    tx = await wax.create_transaction()
    tx.push_operation(
        transfer(
            from_account=YOUR_ACCOUNT_NAME,
            to_account=TRANSFER_RECEIVER,
            amount=wax.hive.satoshis(1),
            memo="hello from wax!")
        )
    return tx

async def sign_tx(unlocked_wallet: AsyncUnlockedWallet, tx: IOnlineTransaction) -> IOnlineTransaction:
    if YOUR_PUBLIC_KEY not in await unlocked_wallet.public_keys:
        await unlocked_wallet.import_key(private_key=YOUR_PRIVATE_KEY)

    await tx.sign(wallet=unlocked_wallet, public_key=YOUR_PUBLIC_KEY)
    return tx

async def main() -> None:
    wallet, session, beekeeper = await create_beekeeper_set()
    tx = await create_tx()

    unlocked_wallet = wallet if await wallet.is_unlocked() else await wallet.unlock(PASSWORD)

    await sign_tx(unlocked_wallet, tx)
    await wax.broadcast(tx)
    await unlocked_wallet.lock()
    await session.close_session()
    beekeeper.teardown()

asyncio.run(main())
