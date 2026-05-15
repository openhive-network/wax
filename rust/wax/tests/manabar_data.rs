use std::str::FromStr;

use rust_decimal::Decimal;
use wax::{Manabar, ManabarData};

fn dp(s: &str) -> Decimal {
    Decimal::from_str(s).unwrap()
}

#[test]
fn full_manabar_reports_100_percent() {
    let m = ManabarData::new(10_000_000, 10_000_000);
    assert_eq!(m.percent(), dp("100.00"));
}

#[test]
fn empty_manabar_reports_0_percent() {
    let m = ManabarData::new(10_000_000, 0);
    assert_eq!(m.percent(), dp("0.00"));
}

#[test]
fn half_manabar_reports_50_percent() {
    let m = ManabarData::new(10_000_000, 5_000_000);
    assert_eq!(m.percent(), dp("50.00"));
}

#[test]
fn percent_truncates_toward_zero() {
    // 1234/10000 = 12.34%. With ROUND_DOWN this stays 12.34.
    let m = ManabarData::new(10_000, 1234);
    assert_eq!(m.percent(), dp("12.34"));
}

#[test]
fn percent_truncates_subprecision_digits() {
    // 7777/10000 = 77.77%. Add one more nonzero digit (77.779%) and we still
    // get 77.77 because Python uses ROUND_DOWN, not banker's rounding.
    let m = ManabarData::new(10_000_000, 7_777_900);
    assert_eq!(m.percent(), dp("77.77"));
}

#[test]
fn percent_for_max_zero_returns_zero() {
    // Mirrors Python's `if self.max_mana <= 0: return Decimal("0.00")`.
    let m = ManabarData::new(0, 0);
    assert_eq!(m.percent(), dp("0.00"));

    let m_neg = ManabarData::new(-1, 0);
    assert_eq!(m_neg.percent(), dp("0.00"));
}

#[test]
fn percent_handles_overfilled_manabar() {
    // current > max is legal at the type level (the C++ regen logic clamps
    // before returning, but we don't assert in the dataclass). Sanity check:
    // we still produce *some* defined percent rather than panicking.
    let m = ManabarData::new(100, 150);
    assert_eq!(m.percent(), dp("150.00"));
}

#[test]
fn accessors_return_stored_fields() {
    let m = ManabarData::new(123, 45);
    assert_eq!(m.max_mana(), 123);
    assert_eq!(m.current_mana(), 45);
}

#[test]
fn trait_is_object_safe() {
    // Future callers (e.g., complex_operations) will hold this as
    // `&dyn Manabar` to stay decoupled from the concrete impl.
    let m = ManabarData::new(10_000, 7_500);
    let dyn_m: &dyn Manabar = &m;
    assert_eq!(dyn_m.max_mana(), 10_000);
    assert_eq!(dyn_m.current_mana(), 7_500);
    assert_eq!(dyn_m.percent(), dp("75.00"));
}
