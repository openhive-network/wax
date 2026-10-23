from __future__ import annotations

import pytest

import test_tools as tt
from test_tools.__private.complex_networks import get_relative_time_offset_from_timestamp


@pytest.mark.parametrize("hours", [-1, 1])
def test_relative_time_offset_of_timestamps_in_the_past_and_in_the_future(hours: int) -> None:
    # ARRANGE
    timestamp = tt.Time.now(serialize=False) + tt.Time.hours(hours)

    # ACT
    time_control = get_relative_time_offset_from_timestamp(timestamp)

    # ASSERT
    assert float(time_control.offset.removesuffix("s")) == pytest.approx(hours * 3600 - 5, abs=1)
