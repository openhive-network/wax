// Smoke tests for the four price-feed asset conversions
// (`hbd_to_hive`, `hive_to_hbd`, `vests_to_hp`, `hp_to_vests`).
//
// Aim: validate the FFI plumbing and asset-symbol enforcement, not exhaustive
// C++ math — that lives in hived. We pick simple feeds where the integer
// arithmetic is easy to verify by hand.

use wax::models::asset::NaiAsset;
use wax::{WaxFoundation, create_wax_foundation};

const HIVE_NAI: &str = "@@000000021";
const HBD_NAI: &str = "@@000000013";
const VESTS_NAI: &str = "@@000000037";
const ASSET_PRECISION: u32 = 3;
const VESTS_PRECISION: u32 = 6;

fn foundation() -> WaxFoundation {
    create_wax_foundation(None)
}

fn hive(amount: i64) -> NaiAsset {
    NaiAsset {
        amount: amount.to_string(),
        precision: ASSET_PRECISION,
        nai: HIVE_NAI.into(),
    }
}

fn hbd(amount: i64) -> NaiAsset {
    NaiAsset {
        amount: amount.to_string(),
        precision: ASSET_PRECISION,
        nai: HBD_NAI.into(),
    }
}

fn vests(amount: i64) -> NaiAsset {
    NaiAsset {
        amount: amount.to_string(),
        precision: VESTS_PRECISION,
        nai: VESTS_NAI.into(),
    }
}

// ---------- hbd_to_hive ------------------------------------------------------

#[test]
fn hbd_to_hive_applies_price_feed() {
    let f = foundation();

    // Feed: 1 HBD (= 1000 sat) costs 10 HIVE (= 10_000 sat). So 1000 HBD sat
    // converts to 10_000 HIVE sat.
    let result = f
        .hbd_to_hive(&hbd(1_000), &hbd(1_000), &hive(10_000))
        .expect("hbd_to_hive");

    assert_eq!(result, hive(10_000));
}

#[test]
fn hbd_to_hive_matches_known_hived_ratio() {
    let f = foundation();

    // Mirrors a value path used in the TS hive_base suite: at base=171,
    // quote=1000 (HBD sat / HIVE sat), converting an HBD balance produces a
    // HIVE balance via integer (amount * quote / base).
    // 1_000_000 * 1000 / 171 = 5_847_953 (truncated)
    let result = f
        .hbd_to_hive(&hbd(1_000_000), &hbd(171), &hive(1_000))
        .expect("hbd_to_hive");

    assert_eq!(result.nai, HIVE_NAI);
    assert_eq!(result.amount, "5847953");
}

#[test]
fn hbd_to_hive_rejects_non_hbd_input() {
    let f = foundation();

    // Passing a HIVE asset where HBD is required must surface the C++ assert
    // as a Rust error.
    let err = f
        .hbd_to_hive(&hive(1_000), &hbd(1_000), &hive(10_000))
        .expect_err("non-HBD input must error");
    assert!(
        err.message().contains("HBD"),
        "error should mention HBD asset: {}",
        err.message()
    );
}

// ---------- hive_to_hbd ------------------------------------------------------

#[test]
fn hive_to_hbd_applies_price_feed() {
    let f = foundation();

    // Same feed as above: 1 HBD = 10 HIVE. So 10_000 HIVE sat → 1000 HBD sat.
    let result = f
        .hive_to_hbd(&hive(10_000), &hbd(1_000), &hive(10_000))
        .expect("hive_to_hbd");

    assert_eq!(result, hbd(1_000));
}

#[test]
fn hive_to_hbd_matches_ts_hive_base_fixture() {
    let f = foundation();

    // From ts/wasm/__tests__/detailed/hive_base.ts: hiveToHbd(13316762799,
    // base=171 HBD sat, quote=1000 HIVE sat) returns "2277166438" HBD sat.
    // The exact value is locked in by the C++ implementation; we keep it as
    // a regression marker rather than recomputing it here.
    let result = f
        .hive_to_hbd(&hive(13_316_762_799), &hbd(171), &hive(1_000))
        .expect("hive_to_hbd");

    assert_eq!(result.nai, HBD_NAI);
    assert_eq!(result.amount, "2277166438");
}

#[test]
fn hive_to_hbd_rejects_non_hive_input() {
    let f = foundation();

    let err = f
        .hive_to_hbd(&hbd(1_000), &hbd(1_000), &hive(10_000))
        .expect_err("non-HIVE input must error");
    assert!(
        err.message().contains("HIVE"),
        "error should mention HIVE asset: {}",
        err.message()
    );
}

// ---------- vests_to_hp ------------------------------------------------------

#[test]
fn vests_to_hp_applies_total_supply_ratio() {
    let f = foundation();

    // Total fund of 1000 HIVE backs 1_000_000 VESTS, so 1_000_000 VESTS
    // converts back to 1000 HIVE.
    let result = f
        .vests_to_hp(&vests(1_000_000), &hive(1_000), &vests(1_000_000))
        .expect("vests_to_hp");

    assert_eq!(result, hive(1_000));
}

#[test]
fn vests_to_hp_rejects_non_vests_input() {
    let f = foundation();

    let err = f
        .vests_to_hp(&hive(1), &hive(1_000), &vests(1_000_000))
        .expect_err("non-VESTS input must error");
    assert!(
        err.message().contains("VESTS"),
        "error should mention VESTS asset: {}",
        err.message()
    );
}

#[test]
fn vests_to_hp_rejects_swapped_totals() {
    let f = foundation();

    // total_vesting_fund_hive must be HIVE; passing a VESTS asset there must
    // fail rather than silently producing garbage.
    let err = f
        .vests_to_hp(&vests(1_000_000), &vests(1_000), &vests(1_000_000))
        .expect_err("total_vesting_fund_hive must be HIVE");
    assert!(
        err.message().contains("HIVE"),
        "error should mention HIVE asset: {}",
        err.message()
    );
}

// ---------- hp_to_vests ------------------------------------------------------

#[test]
fn hp_to_vests_applies_total_supply_ratio() {
    let f = foundation();

    // Same supply parameters as the inverse test: 1000 HIVE ↔ 1_000_000 VESTS.
    let result = f
        .hp_to_vests(&hive(1_000), &hive(1_000), &vests(1_000_000))
        .expect("hp_to_vests");

    assert_eq!(result, vests(1_000_000));
}

#[test]
fn hp_to_vests_round_trips_through_vests_to_hp() {
    let f = foundation();

    let fund = hive(182_849_539_607);
    let shares = vests(312_353_953_479_712_805);

    let hp = hive(1_000_000);
    let v = f.hp_to_vests(&hp, &fund, &shares).expect("hp_to_vests");
    let back = f.vests_to_hp(&v, &fund, &shares).expect("vests_to_hp");

    // Integer truncation can cost at most 1 sat per multiplication, so the
    // round trip should land within a handful of sat of the original.
    let original: i64 = hp.amount.parse().unwrap();
    let rounded: i64 = back.amount.parse().unwrap();
    assert!(
        (original - rounded).abs() <= 1,
        "round trip drifted: {} -> {} -> {}",
        original,
        v.amount,
        rounded
    );
}

#[test]
fn hp_to_vests_rejects_non_hive_input() {
    let f = foundation();

    let err = f
        .hp_to_vests(&hbd(1), &hive(1_000), &vests(1_000_000))
        .expect_err("non-HIVE input must error");
    assert!(
        err.message().contains("HIVE"),
        "error should mention HIVE asset: {}",
        err.message()
    );
}
