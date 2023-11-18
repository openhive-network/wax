from wax import calculate_current_manabar_value

def test_calculate_current_manabar_value():
    result = calculate_current_manabar_value(0, 100, 100, 0)
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == b'100'
