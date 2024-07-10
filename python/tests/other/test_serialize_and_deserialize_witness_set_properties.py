from __future__ import annotations

from wax.wax_result import (
    python_json_asset,
    python_witness_set_properties_data,
    python_price,
)
import wax

import pytest
from .consts import ENCODING

def compare_attributes(a, b) -> bool:
    if isinstance(a, bytes):
        a = a.decode(ENCODING)
    if isinstance(b, bytes):
        b = b.decode(ENCODING)

    return a == b

PROPS_TO_SERIALIZE = (
    [
        {
            "account_creation_fee": python_json_asset(
                amount="28000", precision=3, nai="@@000000021"
            ),
            "key": "STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        },
        {
            "account_subsidy_budget": 797,
            "key": "STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        },
        {
            "account_subsidy_decay": 347321,
            "key": "STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        },
        {
            "maximum_block_size": 131072,
            "key": "STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        },
        {
            "hbd_interest_rate": 1000,
            "key": b"STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        },
        {
            "hbd_exchange_rate": python_price(
                base=python_json_asset(amount="100000", precision=3, nai="@@000000013"),
                quote=python_json_asset(
                    amount="100000", precision=3, nai="@@000000021"
                ),
            ),
            "key": "STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        },
        {
            "url": b"http://new-url.html",
            "key": "STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        },
        {
            "new_signing_key": "STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW",
            "key": "STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        },
        {
            "account_creation_fee": python_json_asset(
                amount="28000", precision=3, nai="@@000000021"
            ),
            "maximum_block_size": 131072,
            "hbd_interest_rate": 1000,
            "hbd_exchange_rate": python_price(
                base=python_json_asset(amount="100000", precision=3, nai="@@000000013"),
                quote=python_json_asset(
                    amount="100000", precision=3, nai="@@000000021"
                ),
            ),
            "new_signing_key": b"STM5P8syqoj7itoDjbtDvCMCb5W3BNJtUjws9v7TDNZKqBLmp3pQW",
            "url": "http://new-url.html",
            "key": "STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
            "account_subsidy_budget": 797,
            "account_subsidy_decay": 347321,
        },
    ],
)


@pytest.mark.parametrize("props_to_serialize", *PROPS_TO_SERIALIZE)
def test_serialize_witness_set_properties(props_to_serialize: dict) -> None:
    serialized_witness_set_properties = wax.serialize_witness_set_properties(
        python_witness_set_properties_data(**props_to_serialize)
    )

    for key in props_to_serialize.keys():
        assert isinstance(
            serialized_witness_set_properties[key.encode(ENCODING)], bytes
        ), f"Key {key} was not serialized"


@pytest.mark.parametrize("props_to_serialize", *PROPS_TO_SERIALIZE)
def test_deserialize_witness_set_properties(props_to_serialize: dict) -> None:
    serialized_witness_set_properties = wax.serialize_witness_set_properties(
        python_witness_set_properties_data(**props_to_serialize)
    )
    deserialized_witness_set_properties = wax.deserialize_witness_set_properties(
        serialized_witness_set_properties
    )
    for key in props_to_serialize.keys():
        assert compare_attributes(props_to_serialize[key], getattr(
            deserialized_witness_set_properties, key
        )), f"Key {key} was not deserialized correctly"


def test_maximum_block_size_parameter() -> None:
    wax.serialize_witness_set_properties(
        python_witness_set_properties_data(
            maximum_block_size=131072,
            key="STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        )
    )


@pytest.mark.parametrize(
    "props_to_serialize",
    [
        python_witness_set_properties_data(
            account_subsidy_budget="incorrect_argument_type",
            key="STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        ),
        {"type": "incorrect_dict"},
        ["incorrect", "list"],
        "incorrect string",
        100,
        True,
    ],
)
@pytest.mark.skip(reason="probably no sense to throw in case of unknown property")
def test_serialize_witness_set_properties_with_incorrect_arguments(
    props_to_serialize: dict,
) -> None:
    with pytest.raises(Exception):
        wax.serialize_witness_set_properties(props_to_serialize)


def test_serialize_witness_set_properties_with_missing_argument() -> None:
    with pytest.raises(TypeError):
        wax.serialize_witness_set_properties()


def test_serialize_witness_set_properties_with_additional_argument() -> None:
    with pytest.raises(TypeError):
        wax.serialize_witness_set_properties(
            python_witness_set_properties_data(
                account_subsidy_budget=123,
                key="STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
            ),
            "addtional_argument",
        )


@pytest.mark.parametrize(
    "props_to_serialize",
    [
        python_witness_set_properties_data(
            account_subsidy_budget=123,
            key="STM57gC3aqyDvu2fPPdfpY2iDtLU6PDb8qD8RGmfxLf1q43PhJYYQ",
        ),
        {
            b"incorrect_argument_name": b"606d00000000000003535445454d0000",
            b"key": b"021df13f04fc422c703043db939c2f98a600fafd0f719a0ff351b8e36c5cad2eff",
        },
        {
            b"account_creation_fee": b"incorrect_argument_value",
            b"key": b"021df13f04fc422c703043db939c2f98a600fafd0f719a0ff351b8e36c5cad2eff",
        },
        ["incorrect", "list"],
        "incorrect string",
        100,
        True,
    ],
)
@pytest.mark.skip(reason="probably no sense to throw in case of unknown property")
def test_deserialize_witness_set_properties_with_incorrect_arguments(
    props_to_serialize: dict,
) -> None:
    with pytest.raises(Exception):
        wax.deserialize_witness_set_properties(props_to_serialize)


def test_deserialize_witness_set_properties_with_missing_argument() -> None:
    with pytest.raises(TypeError):
        wax.deserialize_witness_set_properties()


def test_deserialize_witness_set_properties_with_additional_argument() -> None:
    with pytest.raises(TypeError):
        wax.deserialize_witness_set_properties(
            {
                b"account_creation_fee": b"606d00000000000003535445454d0000",
                b"key": b"021df13f04fc422c703043db939c2f98a600fafd0f719a0ff351b8e36c5cad2eff",
            },
            "addtional_argument",
        )
