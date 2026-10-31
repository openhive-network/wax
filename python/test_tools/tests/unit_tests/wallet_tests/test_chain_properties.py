from __future__ import annotations

import pytest
from hiveio_api.operations import LegacyChainProperties

import test_tools as tt
from test_tools.__private.wallet.constants import as_chain_properties


def test_properties_not_given_in_dict_have_default_values() -> None:
    # ACT
    properties = as_chain_properties({"maximum_block_size": 65536})

    # ASSERT
    defaults = LegacyChainProperties()
    assert properties == LegacyChainProperties(
        account_creation_fee=defaults.account_creation_fee,
        maximum_block_size=65536,
        hbd_interest_rate=defaults.hbd_interest_rate,
    )


def test_properties_given_in_dict_are_taken() -> None:
    # ACT
    properties = as_chain_properties(
        {"account_creation_fee": tt.Asset.Test(3), "maximum_block_size": 65536, "hbd_interest_rate": 0}
    )

    # ASSERT
    assert properties == LegacyChainProperties(
        account_creation_fee=tt.Asset.Test(3), maximum_block_size=65536, hbd_interest_rate=0
    )


def test_model_of_properties_is_taken_as_it_is() -> None:
    # ARRANGE
    properties = LegacyChainProperties(maximum_block_size=65536)

    # ACT & ASSERT
    assert as_chain_properties(properties) is properties


def test_unknown_property_is_rejected() -> None:
    # ARRANGE
    properties: dict[str, object] = {"maximum_block_size": 65536, "account_subsidy_budget": 1}

    # ACT & ASSERT
    with pytest.raises(TypeError, match=r"Unknown properties of a witness: \['account_subsidy_budget'\]"):
        as_chain_properties(properties)  # type: ignore[arg-type]  # a dict with an unknown key is rejected at runtime
