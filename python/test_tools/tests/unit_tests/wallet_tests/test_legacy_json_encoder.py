from __future__ import annotations

import json

import pytest
from hiveio_api.operations import TransferOperation, legacy_operation

import test_tools as tt
from test_tools.__private.communication import Hf26JsonEncoder, LegacyJsonEncoder


@pytest.mark.parametrize(("testnet", "symbol"), [(True, "TESTS"), (False, "HIVE")])
def test_legacy_assets_have_symbols_of_the_network_of_the_wallet(*, testnet: bool, symbol: str) -> None:
    # ARRANGE
    operation = legacy_operation(TransferOperation(from_="alice", to="bob", amount=tt.Asset.Test(1), memo=""))

    # ACT
    encoded = json.dumps(
        {"fee": tt.Asset.Test(2), "operation": operation}, cls=LegacyJsonEncoder, testnet=lambda: testnet
    )

    # ASSERT
    assert json.loads(encoded) == {
        "fee": f"2.000 {symbol}",
        "operation": ["transfer", {"from": "alice", "to": "bob", "amount": f"1.000 {symbol}", "memo": ""}],
    }


def test_encoders_created_without_arguments_use_testnet() -> None:
    # ACT
    encoded = json.dumps({"fee": tt.Asset.Test(2)}, cls=LegacyJsonEncoder)  # e.g. helpers of hive tests

    # ASSERT
    assert json.loads(encoded) == {"fee": "2.000 TESTS"}


def test_nai_assets_do_not_ask_for_the_network() -> None:
    # ARRANGE
    def network_not_asked() -> bool:
        raise AssertionError("the network is asked only for assets in the legacy form")

    # ACT
    encoded = json.dumps({"fee": tt.Asset.Test(2)}, cls=Hf26JsonEncoder, testnet=network_not_asked)

    # ASSERT
    assert json.loads(encoded) == {"fee": {"amount": "2000", "precision": 3, "nai": "@@000000021"}}
