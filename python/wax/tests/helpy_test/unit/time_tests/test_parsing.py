from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest
from schemas.fields.hive_datetime import HiveDateTime

from wax.helpy import Time
from wax.helpy.exceptions import ParseError


@pytest.mark.parametrize(
    ("time", "expected"),
    [
        ("1970-01-01T00:00:00", datetime(1970, 1, 1, tzinfo=timezone.utc)),
        (
            "1970-01-01T00:00:00.250",
            datetime(1970, 1, 1, microsecond=250000, tzinfo=timezone.utc),
        ),
    ],
    ids=("default_format", "default_format_including_millis"),
)
def test_parsing_time_in_default_formats(time: str, expected: datetime) -> None:
    assert Time.parse(time) == expected


@pytest.mark.parametrize("time_zone", [timezone.utc, None, timezone(timedelta(hours=2))], ids=["utc", "naive", "+2"])
@pytest.mark.parametrize(
    "time",
    [
        HiveDateTime("1970-01-01T01:00:00"),
        datetime(1970, 1, 1, 1),  # noqa: DTZ001  # naive, as parsed without a time zone
        datetime(1970, 1, 1, 2, tzinfo=timezone(timedelta(hours=1))),
    ],
    ids=["date_of_models", "naive", "aware"],
)
def test_parsing_datetime_gives_the_time_of_its_string(time: datetime, time_zone: timezone | None) -> None:
    # ARRANGE
    expected = Time.parse("1970-01-01T01:00:00", time_zone=time_zone)

    # ACT
    parsed = Time.parse(time, time_zone=time_zone)

    # ASSERT
    assert parsed == expected
    assert parsed.tzinfo == expected.tzinfo


def test_parsing_invalid_time_in_default_formats() -> None:
    time = "01.01.1970"

    with pytest.raises(ParseError) as exception:
        Time.parse(time)

    assert f"Could not be parse the `{time}` string using the" in str(exception)


def test_parsing_time_in_invalid_custom_format() -> None:
    time = "01.01.1970"
    invalid_format = "invalid_format"

    with pytest.raises(ValueError) as exception:  # noqa: PT011
        assert Time.parse(time, format_=invalid_format)
    assert f"'{invalid_format}' is not a valid TimeFormats" in str(exception.value)
