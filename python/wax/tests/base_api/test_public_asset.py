from __future__ import annotations

from typing import TYPE_CHECKING, Final

import pytest
from hiveio_api import Asset as PublicAsset

from wax._private.models.asset import Asset
from wax.complex_operations.recurrent_transfer import DefineRecurrentTransferOperation, RecurrentTransferData
from wax.complex_operations.update_proposal_operation import UpdateProposalOperation, UpdateProposalOperationData
from wax.exceptions.asset_errors import CannotCreateAssetError
from wax.models.asset import AssetName

if TYPE_CHECKING:
    from wax import ITransaction, IWaxBaseInterface

TX_EXPIRATION: Final[str] = "2023-11-09T21:51:27"


@pytest.mark.parametrize(
    "asset",
    [
        PublicAsset.hive.satoshi(1001),
        PublicAsset("1.001 TESTS"),
        "1.001 HIVE",
        {"amount": "1001", "precision": 3, "nai": "@@000000021"},
        '{"amount": "1001", "precision": 3, "nai": "@@000000021"}',
    ],
    ids=["public asset", "public legacy asset", "legacy string", "nai object", "json of nai object"],
)
def test_assets_in_any_form_are_converted_to_protobuf_assets(asset: object) -> None:
    # ACT
    resolved = Asset().resolve_from_convertible_type(AssetName.Hive, asset)  # type: ignore[arg-type]

    # ASSERT
    assert (resolved.amount, resolved.precision, resolved.nai) == ("1001", 3, "@@000000021")


@pytest.mark.parametrize("asset", [PublicAsset.hbd.satoshi(1001), "1.001 HBD", "1.001 HIVES", {"amount": "1"}, 1001])
def test_values_which_are_not_assets_of_the_expected_kind_are_rejected(asset: object) -> None:
    # ACT & ASSERT
    with pytest.raises(CannotCreateAssetError):
        Asset().resolve_from_convertible_type(AssetName.Hive, asset)  # type: ignore[arg-type]


def test_contract_of_hiveio_api_public_assets_are_equal_to_protobuf_assets(wax: IWaxBaseInterface) -> None:
    """Contract with hiveio-api - public assets are compared with and created from protobuf assets of wax."""
    # ARRANGE
    protobuf_asset = wax.hive.satoshis(1001)

    # ACT & ASSERT
    assert PublicAsset.hive.satoshi(1001) == protobuf_asset
    assert protobuf_asset == PublicAsset.hive.satoshi(1001)
    assert PublicAsset.from_asset_like(protobuf_asset) == PublicAsset("1.001 HIVE")


def test_conversions_take_public_assets(wax: IWaxBaseInterface) -> None:
    # ARRANGE
    base, quote, hive = PublicAsset.hbd.satoshi(171), PublicAsset.hive.satoshi(1000), PublicAsset.hive.satoshi(13316)

    # ACT
    result = wax.hive_to_hbd(hive=hive, base=base, quote=quote)

    # ASSERT
    assert result == wax.hive_to_hbd(
        hive=wax.hive.satoshis(13316), base=wax.hbd.satoshis(171), quote=wax.hive.satoshis(1000)
    )
    assert result == PublicAsset.hbd.satoshi(2277)


@pytest.mark.parametrize(
    "amount", [PublicAsset.hive.satoshi(1000), "1.000 TESTS"], ids=["public asset", "legacy string"]
)
def test_recurrent_transfer_takes_assets_in_any_form(transaction: ITransaction, amount: object) -> None:
    # ARRANGE
    transaction.transaction.expiration = TX_EXPIRATION
    operation = DefineRecurrentTransferOperation(
        RecurrentTransferData(from_account="alice", to_account="bob", amount=amount)  # type: ignore[arg-type]
    )

    # ACT
    transaction.push_operation(operation)

    # ASSERT
    assert transaction.to_dict()["operations"][0]["value"]["amount"] == {
        "amount": "1000",
        "precision": 3,
        "nai": "@@000000021",
    }


def test_update_proposal_takes_public_assets(transaction: ITransaction) -> None:
    # ARRANGE
    transaction.transaction.expiration = TX_EXPIRATION
    operation = UpdateProposalOperation(
        UpdateProposalOperationData(
            proposal_id=1,
            creator="alice",
            daily_pay=PublicAsset.hbd.tokens(1),
            subject="subject",
            permlink="permlink",
        )
    )

    # ACT
    transaction.push_operation(operation)

    # ASSERT
    assert transaction.to_dict()["operations"][0]["value"]["daily_pay"] == {
        "amount": "1000",
        "precision": 3,
        "nai": "@@000000013",
    }


def test_protobuf_assets_of_another_kind_are_rejected(wax: IWaxBaseInterface) -> None:
    # ACT & ASSERT
    with pytest.raises(CannotCreateAssetError):
        wax.hive_to_hbd(hive=wax.hbd.satoshis(13316), base=wax.hbd.satoshis(171), quote=wax.hive.satoshis(1000))
