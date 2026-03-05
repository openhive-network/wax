from wax import calculate_manabar_full_regeneration_time


def test_calculate_manabar_full_regeneration_time():
    result = calculate_manabar_full_regeneration_time(0, 100, 100, 0)
    assert result.status == result.status.ok
    assert result.exception_message == ''
    assert result.result == '0'

def test_calculate_manabar_full_regeneration_time_relaxed():
    result = calculate_manabar_full_regeneration_time(0, 100, 100, 10)
    assert result.status == result.status.ok
    assert result.exception_message == ''
    assert result.result == '10'
