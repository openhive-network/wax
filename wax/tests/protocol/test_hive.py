import json

from wax import hive

def test_hive():
    asset = hive(10)
    assert asset.nai == b'@@000000021'
    assert asset.precision == 3
    assert asset.amount == b'10'

    asset = hive(10000000000)
    assert asset.nai == b'@@000000021'
    assert asset.precision == 3
    assert asset.amount == b'10000000000'
