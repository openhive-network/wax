import json

from wax import general_asset

def test_general_asset():
    asset = general_asset(3200000035, 10)
    assert asset.nai == b'@@000000021'
    assert asset.precision == 3
    assert asset.amount == b'10'
