// Smoke tests for the manabar helpers on WaxFoundation.
// Expected values are anchored to the Python wax suite
// (python/wax/tests/protocol/test_calculate_*.py and
//  python/wax/tests/other/test_calculate_manabar_full_regeneration_time.py).

use chrono::{DateTime, Utc};
use wax::models::basic::HiveDateTime;
use wax::{Manabar, WaxFoundation, create_wax_foundation};

fn foundation() -> Box<dyn WaxFoundation> {
    create_wax_foundation(None)
}

// 5-day regeneration window in seconds — matches HIVE_RC_REGEN_TIME.
const DAY: i64 = 24 * 60 * 60;

/// Builds a `HiveDateTime` from a unix timestamp. Matches the Python tests,
/// which use `int(timedelta(...).total_seconds())` as the "now" anchor.
fn at(seconds: i64) -> HiveDateTime {
    HiveDateTime::from(
        DateTime::<Utc>::from_timestamp(seconds, 0).expect("valid timestamp"),
    )
}

// ---------- calculate_current_manabar_value ---------------------------------

#[test]
fn current_value_at_full_manabar_returns_max() {
    // Mirrors python/wax/tests/protocol/test_calculate_current_manabar_value.py
    //   (now=0, max=100, current=100, last_update=0) → 100
    let f = foundation();
    let m = f
        .calculate_current_manabar_value(at(0), 100, 100, 0)
        .expect("calculate_current_manabar_value");

    assert_eq!(m.max_mana(), 100);
    assert_eq!(m.current_mana(), 100);
}

#[test]
fn current_value_with_now_before_last_update_clamps() {
    // The C++ side clamps `now := max(now, last_update_time)` before regen,
    // so passing now=0 with last_update=10 still yields the full 100.
    let f = foundation();
    let m = f
        .calculate_current_manabar_value(at(0), 100, 100, 10)
        .expect("calculate_current_manabar_value");

    assert_eq!(m.current_mana(), 100);
}

#[test]
fn current_value_fully_regenerates_after_window() {
    // Empty manabar (current=0 at t=0), max=100, with 5 days elapsed — the
    // regen window — must reach max.
    let f = foundation();
    let m = f
        .calculate_current_manabar_value(at(5 * DAY), 100, 0, 0)
        .expect("calculate_current_manabar_value");

    assert_eq!(m.current_mana(), 100);
}

#[test]
fn current_value_partial_regen_increases_mana() {
    // Sanity: with 1 day elapsed on an empty bar, regen should land
    // strictly between 0 and max.
    let f = foundation();
    let m = f
        .calculate_current_manabar_value(at(DAY), 100, 0, 0)
        .expect("calculate_current_manabar_value");

    assert!(
        m.current_mana() > 0 && m.current_mana() < 100,
        "expected partial regen in (0, 100), got {}",
        m.current_mana()
    );
}

// ---------- calculate_manabar_full_regeneration_time ------------------------

#[test]
fn full_regen_time_when_already_full_is_now() {
    // python/wax/tests/protocol/test_calculate_manabar_full_regeneration_time.py
    //   (0, 100, 100, 0) → 0
    let f = foundation();
    let t = f
        .calculate_manabar_full_regeneration_time(at(0), 100, 100, 0)
        .expect("calculate_manabar_full_regeneration_time");

    assert_eq!(t, 0);
}

#[test]
fn full_regen_time_clamps_now_to_last_update() {
    // Same as above but with last_update=10. The C++ side bumps `now` up
    // to last_update_time when it's earlier — expected result is 10.
    let f = foundation();
    let t = f
        .calculate_manabar_full_regeneration_time(at(0), 100, 100, 10)
        .expect("calculate_manabar_full_regeneration_time");

    assert_eq!(t, 10);
}

#[test]
fn full_regen_time_empty_bar_finishes_one_window_later() {
    // python/wax/tests/other/test_calculate_manabar_full_regeneration_time.py
    //   (day=5, max=100, current=0, last=day=0) → day=5
    let f = foundation();
    let t = f
        .calculate_manabar_full_regeneration_time(at(5 * DAY), 100, 0, 0)
        .expect("calculate_manabar_full_regeneration_time");

    assert_eq!(t, (5 * DAY) as u64);
}

#[test]
fn full_regen_time_partially_drained_finishes_within_window() {
    // (day=3, max=100, current=20, last=day=1) → day=5
    let f = foundation();
    let t = f
        .calculate_manabar_full_regeneration_time(
            at(3 * DAY),
            100,
            20,
            DAY as u32,
        )
        .expect("calculate_manabar_full_regeneration_time");

    assert_eq!(t, (5 * DAY) as u64);
}

#[test]
fn full_regen_time_after_full_returns_now() {
    // (day=6, max=100, current=80, last=day=4) → day=6 — once already
    // regenerated, the function returns `now`.
    let f = foundation();
    let t = f
        .calculate_manabar_full_regeneration_time(
            at(6 * DAY),
            100,
            80,
            (4 * DAY) as u32,
        )
        .expect("calculate_manabar_full_regeneration_time");

    assert_eq!(t, (6 * DAY) as u64);
}

#[test]
fn head_block_time_accepts_parsed_hive_format() {
    // End-to-end: parse a Hive-format timestamp and use it as the anchor.
    // 1970-01-06T00:00:00 = 5 * 86400 seconds; on an empty bar this hits
    // exactly the full-regen boundary, so current must reach max.
    let f = foundation();

    let head =
        HiveDateTime::parse("1970-01-06T00:00:00").expect("parse hive format");
    let m = f
        .calculate_current_manabar_value(head, 100, 0, 0)
        .expect("calculate_current_manabar_value");
    assert_eq!(m.current_mana(), 100);
}
