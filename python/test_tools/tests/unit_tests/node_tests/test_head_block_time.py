from __future__ import annotations

from datetime import UTC, datetime

from hiveio_api.database_api import GetDynamicGlobalPropertiesResponse

from test_tools.__private.hived.common_helpers import HiveHandleCommonHelpers


def test_head_block_time_is_the_aware_date_of_models() -> None:
    # ARRANGE
    properties = GetDynamicGlobalPropertiesResponse.from_builtins({"time": "2026-01-01T00:00:00"}, warn=False)

    # ACT
    head_block_time = HiveHandleCommonHelpers()._get_head_block_time(properties)

    # ASSERT
    assert head_block_time.tzinfo is not None
    assert head_block_time == datetime(2026, 1, 1, tzinfo=UTC)
    assert head_block_time == datetime(2026, 1, 1), "naive dates are compared as dates in UTC"
