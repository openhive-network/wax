// Smoke tests for the economics-helper foundation methods
// (`estimate_hive_collateral`, `estimate_hbd_interest`, `calculate_hp_apr`).
//
// Aim: validate the FFI plumbing and that we forward the right parameters to
// the underlying hived C++ routines. Expected outputs are anchored to the
// Python wax suite (python/wax/tests/...), so any divergence is a regression
// against the canonical implementation rather than reinventing the math here.

use wax::models::asset::NaiAsset;
use wax::result::JsonPrice;
use wax::{WaxFoundation, create_wax_foundation};

const HIVE_NAI: &str = "@@000000021";
const HBD_NAI: &str = "@@000000013";
const ASSET_PRECISION: u32 = 3;

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

// ---------- estimate_hive_collateral -----------------------------------------

#[test]
fn estimate_hive_collateral_matches_python_fixture() {
    // Mirrors python/wax/tests/base_api/test_estimate_hive_collateral.py:
    // median  base=201 HBD sat / quote=1000 HIVE sat
    // minimum base=197 HBD sat / quote=1000 HIVE sat
    // request 100_000 HBD sat → expect 1_065_988 HIVE sat.
    let f = foundation();

    let median = JsonPrice {
        base: hbd(201),
        quote: hive(1_000),
    };
    let minimum = JsonPrice {
        base: hbd(197),
        quote: hive(1_000),
    };

    let result = f
        .estimate_hive_collateral(&median, &minimum, &hbd(100_000))
        .expect("estimate_hive_collateral");

    assert_eq!(result, hive(1_065_988));
}

#[test]
fn estimate_hive_collateral_scales_with_hbd_amount() {
    // Sanity check: doubling the HBD target asks for roughly twice the HIVE
    // collateral. Exact equality is not guaranteed (integer rounding) but the
    // result should sit within a satoshi of double.
    let f = foundation();

    let median = JsonPrice {
        base: hbd(201),
        quote: hive(1_000),
    };
    let minimum = JsonPrice {
        base: hbd(197),
        quote: hive(1_000),
    };

    let single = f
        .estimate_hive_collateral(&median, &minimum, &hbd(100_000))
        .expect("estimate_hive_collateral single");
    let doubled = f
        .estimate_hive_collateral(&median, &minimum, &hbd(200_000))
        .expect("estimate_hive_collateral doubled");

    let single_amount: i64 = single.amount.parse().unwrap();
    let doubled_amount: i64 = doubled.amount.parse().unwrap();
    // Hive's collateral formula adds a fixed premium so doubling the HBD
    // amount can drift by a few satoshi from a strict 2x; allow a small slack
    // to keep this a smoke check rather than a brittle math reproduction.
    let diff = (doubled_amount - 2 * single_amount).abs();
    assert!(
        diff <= 4,
        "doubled collateral drifted by {} sat: 2*{} vs {}",
        diff,
        single_amount,
        doubled_amount
    );
}

// ---------- estimate_hbd_interest --------------------------------------------

#[test]
fn estimate_hbd_interest_matches_python_fixture() {
    // Mirrors python/wax/tests/base_api/test_estimate_hbd_interest.py:
    //   account_hbd_seconds = 2_860_100_980_056
    //   hbd_balance         = 46_107_782 HBD sat
    //   last_compound       = 2025-11-15T20:27:54 UTC → 1_763_231_274
    //   now                 = 2025-11-26T16:05:33 UTC → 1_764_165_933
    //   interest_rate       = 1500 (basis points)
    // Expected interest paid: 218_584 HBD sat.
    let f = foundation();

    let result = f
        .estimate_hbd_interest(
            2_860_100_980_056_u128,
            1_764_165_933,
            &hbd(46_107_782),
            1_763_231_274,
            1_500,
        )
        .expect("estimate_hbd_interest");

    assert_eq!(result, hbd(218_584));
}

#[test]
fn estimate_hbd_interest_zero_balance_returns_zero() {
    // With zero seconds accrued and a zero balance the interest must collapse
    // to a zero HBD asset rather than misbehaving on the u128 split.
    let f = foundation();

    let result = f
        .estimate_hbd_interest(
            0_u128,
            1_764_165_933,
            &hbd(0),
            1_764_165_933,
            1_500,
        )
        .expect("estimate_hbd_interest");

    assert_eq!(result, hbd(0));
}

#[test]
fn estimate_hbd_interest_rejects_non_hbd_balance() {
    let f = foundation();

    let err = f
        .estimate_hbd_interest(
            2_860_100_980_056_u128,
            1_764_165_933,
            &hive(46_107_782),
            1_763_231_274,
            1_500,
        )
        .expect_err("non-HBD balance must error");
    assert!(
        !err.message().is_empty(),
        "error should not be empty: {}",
        err.message()
    );
}

// ---------- calculate_hp_apr -------------------------------------------------

#[test]
fn calculate_hp_apr_matches_python_protocol_fixture() {
    // Mirrors python/wax/tests/protocol/test_calculate_hp_apr.py:
    //   head_block_num=1_000_000, vesting_reward_percent=1500,
    //   virtual_supply / total_vesting_fund_hive both as HIVE assets.
    let f = foundation();

    let apr = f
        .calculate_hp_apr(
            1_000_000,
            1_500,
            &hive(530_656_835_180),
            &hive(173_009_633_181),
        )
        .expect("calculate_hp_apr");
    assert_eq!(apr, "4.48");

    let apr_later = f
        .calculate_hp_apr(
            82_779_364,
            1_500,
            &hive(530_656_835_180),
            &hive(173_009_633_181),
        )
        .expect("calculate_hp_apr later block");
    assert_eq!(apr_later, "2.97");
}

#[test]
fn calculate_hp_apr_matches_python_base_api_fixture() {
    // Mirrors python/wax/tests/base_api/test_calculate_hp_apr.py:
    //   head_block_num=1_000_000, vesting_reward_percent=1500,
    //   virtual_supply = total_vesting_fund_hive = 10 HIVE (= 10_000 sat),
    // expected "1.46" (Python's Decimal post-format keeps trailing zeros).
    let f = foundation();

    let apr = f
        .calculate_hp_apr(1_000_000, 1_500, &hive(10_000), &hive(10_000))
        .expect("calculate_hp_apr");

    // C++ returns the raw "<int>.<int>" form; Decimal normalization happens in
    // the Python layer. "1.46" and "1.46" must agree numerically.
    let parsed: f64 = apr.parse().expect("apr should be numeric");
    assert!(
        (parsed - 1.46_f64).abs() < 1e-9,
        "expected ~1.46, got '{}'",
        apr
    );
}

#[test]
fn calculate_hp_apr_rejects_non_hive_virtual_supply() {
    let f = foundation();

    let err = f
        .calculate_hp_apr(
            1_000_000,
            1_500,
            &hbd(530_656_835_180),
            &hive(173_009_633_181),
        )
        .expect_err("virtual_supply must be HIVE");
    assert!(
        err.message().contains("HIVE"),
        "error should mention HIVE asset: {}",
        err.message()
    );
}
