// Tests for the asset constructors on WaxFoundation:
//   - `hive_coins` / `hbd_coins` / `vests_coins` — scale a coin amount by
//     10^precision and truncate (mirrors TS `hiveCoins` / `hbdCoins` /
//     `vestsCoins`)
//   - `hive_satoshis` / `hbd_satoshis` / `vests_satoshis` — pass-through
//     for raw satoshi counts

use std::str::FromStr;

use rust_decimal::Decimal;
use wax::{WaxFoundation, create_wax_foundation};

const HIVE_NAI: &str = "@@000000021";
const HBD_NAI: &str = "@@000000013";
const VESTS_NAI: &str = "@@000000037";
const ASSET_PRECISION: u32 = 3;
const VESTS_PRECISION: u32 = 6;

fn foundation() -> WaxFoundation {
    create_wax_foundation(None)
}

fn dp(s: &str) -> Decimal {
    Decimal::from_str(s).unwrap()
}

// ---------- _coins (scaled amounts) ------------------------------------------

#[test]
fn hive_coins_scales_integer_by_precision() {
    // 1 HIVE @ precision 3 = 1000 satoshi.
    let f = foundation();

    let asset = f.hive_coins(1).expect("hive_coins");

    assert_eq!(asset.amount, "1000");
    assert_eq!(asset.precision, ASSET_PRECISION);
    assert_eq!(asset.nai, HIVE_NAI);
}

#[test]
fn hive_coins_scales_decimal_by_precision() {
    // 1.5 HIVE @ precision 3 = 1500 satoshi.
    let f = foundation();

    let asset = f.hive_coins(dp("1.5")).expect("hive_coins");

    assert_eq!(asset.amount, "1500");
}

#[test]
fn hive_coins_truncates_subprecision_digits() {
    // 1.2349 HIVE @ precision 3 → trunc(1234.9) = 1234. Matches the TS
    // `naiAssetToLong` rule (`frac.substring(0, precision)`), not rounding.
    let f = foundation();

    let asset = f.hive_coins(dp("1.2349")).expect("hive_coins");

    assert_eq!(asset.amount, "1234");
}

#[test]
fn hive_coins_accepts_float_input() {
    let f = foundation();

    let asset = f.hive_coins(2.5).expect("hive_coins float");

    assert_eq!(asset.amount, "2500");
}

#[test]
fn hbd_coins_uses_same_precision_as_hive() {
    let f = foundation();

    let asset = f.hbd_coins(2).expect("hbd_coins");

    assert_eq!(asset.amount, "2000");
    assert_eq!(asset.precision, ASSET_PRECISION);
    assert_eq!(asset.nai, HBD_NAI);
}

#[test]
fn vests_coins_uses_six_decimal_precision() {
    // 1 VESTS @ precision 6 = 1_000_000 satoshi.
    let f = foundation();

    let asset = f.vests_coins(1).expect("vests_coins");

    assert_eq!(asset.amount, "1000000");
    assert_eq!(asset.precision, VESTS_PRECISION);
    assert_eq!(asset.nai, VESTS_NAI);
}

#[test]
fn vests_coins_handles_six_decimal_amount() {
    // 1.234567 VESTS @ precision 6 = 1234567 satoshi (no truncation, since
    // there are exactly 6 fractional digits).
    let f = foundation();

    let asset = f.vests_coins(dp("1.234567")).expect("vests_coins");

    assert_eq!(asset.amount, "1234567");
}

#[test]
fn vests_coins_truncates_seventh_digit() {
    // 1.2345679 VESTS @ precision 6 → trunc(1234567.9) = 1234567.
    let f = foundation();

    let asset = f.vests_coins(dp("1.2345679")).expect("vests_coins");

    assert_eq!(asset.amount, "1234567");
}

#[test]
fn hive_coins_zero_is_zero_satoshi() {
    let f = foundation();

    let asset = f.hive_coins(0).expect("hive_coins");

    assert_eq!(asset.amount, "0");
    assert_eq!(asset.nai, HIVE_NAI);
}

#[test]
fn hive_coins_negative_amount_preserves_sign() {
    // Negative amounts are well-defined for the scaling math even if they're
    // not physically meaningful on a balance; just verify the sign survives
    // the cpp_hive round-trip.
    let f = foundation();

    let asset = f.hive_coins(-2).expect("hive_coins");

    assert_eq!(asset.amount, "-2000");
}

// ---------- _satoshis (raw amounts) ------------------------------------------

#[test]
fn hive_satoshis_passes_amount_through() {
    let f = foundation();

    let asset = f.hive_satoshis(42).expect("hive_satoshis");

    assert_eq!(asset.amount, "42");
    assert_eq!(asset.precision, ASSET_PRECISION);
    assert_eq!(asset.nai, HIVE_NAI);
}

#[test]
fn hbd_satoshis_passes_amount_through() {
    let f = foundation();

    let asset = f.hbd_satoshis(7).expect("hbd_satoshis");

    assert_eq!(asset.amount, "7");
    assert_eq!(asset.nai, HBD_NAI);
}

#[test]
fn vests_satoshis_passes_amount_through() {
    let f = foundation();

    let asset = f.vests_satoshis(123_456).expect("vests_satoshis");

    assert_eq!(asset.amount, "123456");
    assert_eq!(asset.precision, VESTS_PRECISION);
    assert_eq!(asset.nai, VESTS_NAI);
}

// ---------- coins/satoshis equivalence --------------------------------------

#[test]
fn hive_coins_equivalent_to_hive_satoshis_after_scaling() {
    // `hive_coins(n)` must produce the same asset as
    // `hive_satoshis(n * 10^precision)` for integer n.
    let f = foundation();

    let via_coins = f.hive_coins(3).expect("hive_coins");
    let via_satoshis = f.hive_satoshis(3_000).expect("hive_satoshis");

    assert_eq!(via_coins, via_satoshis);
}

#[test]
fn vests_coins_equivalent_to_vests_satoshis_after_scaling() {
    let f = foundation();

    let via_coins = f.vests_coins(2).expect("vests_coins");
    let via_satoshis = f.vests_satoshis(2_000_000).expect("vests_satoshis");

    assert_eq!(via_coins, via_satoshis);
}
