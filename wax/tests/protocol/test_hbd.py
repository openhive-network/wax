import json
import sys

from wax import hbd

def test_hbd():
    asset = hbd(sys.maxsize)
    assert asset.nai == b'@@000000013'
    assert asset.precision == 3
    assert asset.amount == str(sys.maxsize).encode()
