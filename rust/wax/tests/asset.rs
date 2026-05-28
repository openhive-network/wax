use rust_decimal::Decimal;
use std::str::FromStr;

use wax::models::asset::{
    Asset, AssetAmount, AssetFactory, AssetName, NaiAsset, NaiAssetConvertible,
};

const HIVE_NAI: &str = "@@000000021";
const HBD_NAI: &str = "@@000000013";
const VESTS_NAI: &str = "@@000000037";
const ASSET_PRECISION: u32 = 3;
const VESTS_PRECISION: u32 = 6;

fn asset() -> Asset {
    Asset::new()
        .expect("Asset::new should succeed against the cpp protocol singleton")
}

// ---------- get_asset_info ----------------------------------------------------

#[test]
fn get_asset_info_returns_canonical_nai_and_precision() {
    let a = asset();

    let hive = a.get_asset_info(AssetName::Hive).unwrap();
    assert_eq!(hive.nai, HIVE_NAI);
    assert_eq!(hive.precision, ASSET_PRECISION);

    let hbd = a.get_asset_info(AssetName::Hbd).unwrap();
    assert_eq!(hbd.nai, HBD_NAI);
    assert_eq!(hbd.precision, ASSET_PRECISION);

    let vests = a.get_asset_info(AssetName::Vests).unwrap();
    assert_eq!(vests.nai, VESTS_NAI);
    assert_eq!(vests.precision, VESTS_PRECISION);
}

// ---------- create_wax_asset (precision path) --------------------------------

#[test]
fn create_wax_asset_applies_precision_for_integer_amounts() {
    let a = asset();

    // 1 HIVE @ precision 3 = "1000" satoshis.
    let hive = a
        .create_wax_asset(AssetName::Hive, AssetAmount::Int(1), true)
        .unwrap();
    assert_eq!(hive.amount, "1000");
    assert_eq!(hive.precision, ASSET_PRECISION);
    assert_eq!(hive.nai, HIVE_NAI);
}

#[test]
fn create_wax_asset_applies_precision_for_decimal_amounts() {
    let a = asset();

    // 1.5 HIVE @ precision 3 = "1500" satoshis.
    let amount = AssetAmount::Decimal(Decimal::from_str("1.5").unwrap());
    let asset = a.create_wax_asset(AssetName::Hive, amount, true).unwrap();
    assert_eq!(asset.amount, "1500");
}

#[test]
fn create_wax_asset_truncates_subprecision_digits() {
    let a = asset();

    // 1.2349 HIVE @ precision 3: Python's `int(Decimal("1.2349") * 1000) =
    // int(Decimal("1234.9")) = 1234`. Truncation, not rounding.
    let amount = AssetAmount::Decimal(Decimal::from_str("1.2349").unwrap());
    let asset = a.create_wax_asset(AssetName::Hive, amount, true).unwrap();
    assert_eq!(asset.amount, "1234");
}

#[test]
fn create_wax_asset_handles_six_decimal_vests() {
    let a = asset();

    let amount = AssetAmount::Decimal(Decimal::from_str("1.234567").unwrap());
    let asset = a.create_wax_asset(AssetName::Vests, amount, true).unwrap();
    assert_eq!(asset.amount, "1234567");
    assert_eq!(asset.precision, VESTS_PRECISION);
    assert_eq!(asset.nai, VESTS_NAI);
}

#[test]
fn create_wax_asset_via_float_input() {
    let a = asset();

    // f64::from(1.5) should round-trip through Decimal::from_f64_retain
    // and produce the same "1500" satoshis as the Decimal input.
    let asset = a
        .create_wax_asset(AssetName::Hive, AssetAmount::Float(1.5), true)
        .unwrap();
    assert_eq!(asset.amount, "1500");
}

#[test]
fn create_wax_asset_without_precision_passes_amount_through() {
    let a = asset();

    // use_precision=false stringifies amount as-is (no 10^precision
    // multiplication) — mirrors Python's `str(amount)` branch.
    let asset = a
        .create_wax_asset(AssetName::Hive, AssetAmount::Int(1500), false)
        .unwrap();
    assert_eq!(asset.amount, "1500");
    assert_eq!(asset.precision, ASSET_PRECISION);
    assert_eq!(asset.nai, HIVE_NAI);
}

// ---------- create_asset_satoshis --------------------------------------------

#[test]
fn create_asset_satoshis_passes_amount_through() {
    let a = asset();

    let asset = a.create_asset_satoshis(AssetName::Hive, 42).unwrap();
    assert_eq!(asset.amount, "42");
    assert_eq!(asset.precision, ASSET_PRECISION);
    assert_eq!(asset.nai, HIVE_NAI);
}

// ---------- factory ----------------------------------------------------------

#[test]
fn factory_coins_uses_precision() {
    let a = asset();
    let factory = a.create_asset_factory(AssetName::Hive);

    let asset = factory.coins(AssetAmount::Int(2)).unwrap();
    assert_eq!(asset.amount, "2000");
    assert_eq!(asset.nai, HIVE_NAI);
}

#[test]
fn factory_satoshis_bypasses_precision() {
    let a = asset();
    let factory = a.create_asset_factory(AssetName::Hbd);

    let asset = factory.satoshis(42).unwrap();
    assert_eq!(asset.amount, "42");
    assert_eq!(asset.nai, HBD_NAI);
    assert_eq!(asset.precision, ASSET_PRECISION);
}

// ---------- resolve_from_convertible_type ------------------------------------

#[test]
fn resolve_passes_through_matching_proto_asset() {
    let a = asset();

    let input = NaiAsset {
        amount: "1000".into(),
        precision: ASSET_PRECISION,
        nai: HIVE_NAI.into(),
    };
    let resolved = a
        .resolve_from_convertible_type(
            AssetName::Hive,
            NaiAssetConvertible::Asset(input.clone()),
        )
        .unwrap();
    assert_eq!(resolved, input);
}

#[test]
fn resolve_rejects_wrong_nai() {
    let a = asset();

    // Tell `resolve` we want HIVE, but pass an HBD-shaped NaiAsset — must error.
    // Mirrors Python's `assert valid_asset.nai == asset_to_check.nai, "Nai is not
    // the same as expected."` (so the message is the assertion text, not the
    // offending nai itself).
    let input = NaiAsset {
        amount: "1000".into(),
        precision: ASSET_PRECISION,
        nai: HBD_NAI.into(),
    };
    let err = a
        .resolve_from_convertible_type(
            AssetName::Hive,
            NaiAssetConvertible::Asset(input),
        )
        .expect_err("mismatched nai must error");

    assert_eq!(err.message(), "Nai is not the same as expected.");
}

// ---------- normalize_asset --------------------------------------------------

#[test]
fn normalize_asset_dispatches_through_matching_cpp_constructor() {
    let a = asset();

    let input = NaiAsset {
        amount: "1500".into(),
        precision: ASSET_PRECISION,
        nai: HIVE_NAI.into(),
    };
    let normalized = a.normalize_asset(input).unwrap();
    assert_eq!(
        normalized,
        NaiAsset {
            amount: "1500".into(),
            precision: ASSET_PRECISION,
            nai: HIVE_NAI.into(),
        }
    );
}

#[test]
fn normalize_asset_rejects_unknown_nai() {
    let a = asset();

    let input = NaiAsset {
        amount: "1500".into(),
        precision: ASSET_PRECISION,
        nai: "@@deadbeef0".into(),
    };
    let err = a
        .normalize_asset(input)
        .expect_err("unknown nai must error");
    assert!(
        err.message().contains("@@deadbeef0"),
        "error should mention the unknown nai: {}",
        err.message()
    );
}

#[test]
fn normalize_asset_rejects_non_integer_amount() {
    let a = asset();

    let input = NaiAsset {
        amount: "not-a-number".into(),
        precision: ASSET_PRECISION,
        nai: HIVE_NAI.into(),
    };
    assert!(
        a.normalize_asset(input).is_err(),
        "non-integer amount must error"
    );
}
