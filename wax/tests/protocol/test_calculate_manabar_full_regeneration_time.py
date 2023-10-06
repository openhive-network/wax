from wax import calculate_manabar_full_regeneration_time

def test_calculate_manabar_full_regeneration_time():
    result = calculate_manabar_full_regeneration_time(0, 100, 100, 0)
    assert result.status == result.status.ok
    assert result.exception_message == b''
    assert result.result == b'0'
