from __future__ import annotations

from typing import Any

import pytest

from tests.base_api.templates import INPUT_WITNESS_PROPERTIES, WITNESS_PROPERTIES
from wax import cpp_python_bridge


def test_serialize_witness_set_properties_0() -> None:
    serialized = cpp_python_bridge.serialize_witness_set_properties(INPUT_WITNESS_PROPERTIES)
    assert serialized["key"] == "029072da2e84ebd6eb520f944db3d1af718500b0f1ddf60e11e986f990acddd524"
    assert serialized["hbd_exchange_rate"] == "11010000000000000320bcbee8030000000000002320bcbe"


def test_serialize_witness_set_properties_1() -> Any:  # noqa: ANN401
    serialized = cpp_python_bridge.serialize_witness_set_properties(WITNESS_PROPERTIES)

    assert serialized["account_creation_fee"] == "88130000000000002320bcbe"
    assert serialized["account_subsidy_budget"] == "1d030000"
    assert serialized["account_subsidy_decay"] == "b94c0500"
    assert serialized["hbd_exchange_rate"] == "64000000000000000320bcbe64000000000000002320bcbe"
    assert serialized["hbd_interest_rate"] == "e803"
    assert serialized["key"] == "02472d6eb6d691b6de8b103b51ebdf4e128a523946d8cd03d6ded91b1497ee2e83"
    assert serialized["maximum_block_size"] == "00000200"
    assert serialized["url"] == "0f68747470733a2f2f686976652e696f"
    assert (
        serialized["new_signing_key"] == "02cf69b1f999d133ebbe178a8b4bbf4da356b264dfdc843b1c740378bff8f65b33"
    )

    return serialized


@pytest.mark.skip(reason="method not implemented.")
@pytest.mark.describe("Should be able to serialize witness properties and then deserialize")
def test_serialize_witness_set_properties_2() -> None:
    serialized = test_serialize_witness_set_properties_1()
    deserialized = cpp_python_bridge.deserialize_witness_set_properties(serialized)
    assert deserialized == WITNESS_PROPERTIES
