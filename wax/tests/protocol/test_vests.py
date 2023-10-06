import json
import sys

from wax import vests

def test_vests():
    asset = vests(-sys.maxsize - 1)
    assert asset.nai == b'@@000000037'
    assert asset.precision == 6
    assert asset.amount == str(-sys.maxsize - 1).encode()
