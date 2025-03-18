import asyncio

from beekeepy import AsyncBeekeeper
from beekeepy.interfaces import HttpUrl
from wax import create_wax_foundation
from wax.proto.operations import transfer


PASSWORD = "pass"
WALLET_NAME = "alice"
HIVED_ADDRESS = HttpUrl("https://api.hive.blog")

wax = create_wax_foundation()
keys = wax.suggest_brain_key()

trx = wax.create_transaction_with_tapos("00000449f7860b82b4fbe2f317c670e9f01d6d9a")
trx.push_operation(transfer(from_account="alice", to_account="bob", amount=wax.hive.satoshis(10)))


async def sign_trx():
    async with await AsyncBeekeeper.factory() as beekeeper:
        async with await beekeeper.create_session() as session:
            wallet = await session.create_wallet(name=WALLET_NAME, password=PASSWORD)
            await wallet.import_key(private_key=keys.wif_private_key)
            await trx.sign(wallet=wallet, public_key=keys.associated_public_key)
            print(f"broadcasting: {trx.to_api_json()}")

async def main():
    await sign_trx()

asyncio.run(main())
