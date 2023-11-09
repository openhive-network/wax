import json

from utils.refs import API_REF_TRANSACTION, PROTO_REF_TRANSACTION

from wax import calculate_sig_digest

def test_calculate_sig_digest():
    tx_str = json.dumps(API_REF_TRANSACTION)
    result = calculate_sig_digest(tx_str.encode(), b'beeab0de00000000000000000000000000000000000000000000000000000000')
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == b'b31ff450905ad705ed0d7fd5e270c3685442203e15e1b1e7d5e94b35dcdc1693'

    # Negative test
    tx_str = json.dumps(PROTO_REF_TRANSACTION)
    result = calculate_sig_digest(tx_str.encode(), b'beeab0de00000000000000000000000000000000000000000000000000000000')
    assert result.status == result.status.fail
    assert result.exception_message == (
        b'10 assert_exception: Assert Exception\nv_object.contains( "type" )\nType field doesn\'t exist.\n    {}\n    static_variant.hpp:482 from_variant')
