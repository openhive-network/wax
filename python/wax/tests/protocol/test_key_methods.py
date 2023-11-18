import re
from wax import generate_private_key, calculate_public_key

def test_key_methods():
    result = generate_private_key()
    private_key = result.result
    assert result.status == result.status.ok
    assert result.exception_message == b''

    result = calculate_public_key(private_key)
    public_key = result.result
    assert result.status == result.status.ok
    assert result.exception_message == b''
    pat = re.compile('^[1-9A-HJ-NP-Za-km-z]+$')
    assert pat.match(public_key.decode()) is not None
