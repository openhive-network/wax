from beekeepy import Beekeeper
from wax import create_wax_foundation
from wax.proto.asset_pb2 import asset
from wax.proto.transfer_pb2 import transfer

PASSWORD = "pass"
WALLET_NAME = "alice"

wax = create_wax_foundation()
keys = wax.suggest_brain_key()

trx = wax.create_transaction_with_tapos("0576f3eb552fa3c7b8b103f1016c15ce2a259a0f")
trx.push_operation(transfer(from_account="alice", to_account="bob", amount=asset(**wax.hbd.satoshis(10).dict())))


with Beekeeper.factory() as beekeeper, beekeeper.create_session() as session, (
    session.create_wallet(name=WALLET_NAME, password=PASSWORD)
    if WALLET_NAME not in [w.name for w in session.wallets_created]
    else session.open_wallet(name=WALLET_NAME).unlock(PASSWORD)
) as wallet:
    wallet.import_key(private_key=keys.wif_private_key)
    trx.sign(wallet=wallet, public_key=keys.associated_public_key)

print(f"Signed transaction: {trx.to_api_json()}")
