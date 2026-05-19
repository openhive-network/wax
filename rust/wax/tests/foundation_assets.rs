// Tests for the asset-helper methods on the WaxFoundation trait:
//   - `create_asset_with_required_symbol` (mirrors Python's
//     `resolve_from_convertible_type`)
//   - `get_asset` (mirrors TS `getAsset`, backed by C++ `cpp_asset_symbol` and
//     `cpp_asset_value`)

use wax::models::asset::{AssetName, NaiAsset, NaiAssetConvertible};
use wax::result::HiveAssetData;
use wax::{WaxFoundation, create_wax_foundation};

const HIVE_NAI: &str = "@@000000021";
const HBD_NAI: &str = "@@000000013";
const VESTS_NAI: &str = "@@000000037";
const ASSET_PRECISION: u32 = 3;
const VESTS_PRECISION: u32 = 6;

fn foundation() -> Box<dyn WaxFoundation> {
    create_wax_foundation(None)
}

fn proto(amount: &str, precision: u32, nai: &str) -> NaiAsset {
    NaiAsset {
        amount: amount.into(),
        precision,
        nai: nai.into(),
    }
}

fn json(amount: &str, precision: u32, nai: &str) -> NaiAsset {
    NaiAsset {
        amount: amount.into(),
        precision,
        nai: nai.into(),
    }
}

// ---------- create_asset_with_required_symbol --------------------------------

#[test]
fn create_asset_with_required_symbol_passes_matching_asset_through() {
    let f = foundation();

    let input = proto("1000", ASSET_PRECISION, HIVE_NAI);
    let resolved = f
        .create_asset_with_required_symbol(
            AssetName::Hive,
            NaiAssetConvertible::Asset(input.clone()),
        )
        .expect("HIVE asset against HIVE required must pass");

    assert_eq!(resolved, input);
}

#[test]
fn create_asset_with_required_symbol_accepts_vests() {
    let f = foundation();

    let input = proto("1234567", VESTS_PRECISION, VESTS_NAI);
    let resolved = f
        .create_asset_with_required_symbol(
            AssetName::Vests,
            NaiAssetConvertible::Asset(input.clone()),
        )
        .expect("VESTS asset against VESTS required must pass");

    assert_eq!(resolved, input);
}

#[test]
fn create_asset_with_required_symbol_rejects_mismatched_nai() {
    let f = foundation();

    // Ask for HIVE but hand it an HBD-shaped asset.
    let input = proto("1000", ASSET_PRECISION, HBD_NAI);
    let err = f
        .create_asset_with_required_symbol(AssetName::Hive, NaiAssetConvertible::Asset(input))
        .expect_err("mismatched nai must error");

    // The underlying Asset helper raises "Nai is not the same as expected.".
    assert_eq!(err.message(), "Nai is not the same as expected.");
}

#[test]
fn create_asset_with_required_symbol_accepts_valid_json_string() {
    let f = foundation();

    let json_str = format!(
        "{{\"amount\":\"1000\",\"precision\":{},\"nai\":\"{}\"}}",
        ASSET_PRECISION, HIVE_NAI
    );
    let resolved = f
        .create_asset_with_required_symbol(AssetName::Hive, NaiAssetConvertible::Json(json_str))
        .expect("valid HIVE JSON must resolve");

    assert_eq!(resolved, proto("1000", ASSET_PRECISION, HIVE_NAI));
}

#[test]
fn create_asset_with_required_symbol_rejects_json_with_wrong_nai() {
    // Mismatched nai is wrapped into CannotCreateAsset (mirrors Python's
    // try/except around _assert_asset_nai_valid on the JSON branch).
    let f = foundation();

    let json_str = format!(
        "{{\"amount\":\"1000\",\"precision\":{},\"nai\":\"{}\"}}",
        ASSET_PRECISION, HBD_NAI
    );
    let err = f
        .create_asset_with_required_symbol(
            AssetName::Hive,
            NaiAssetConvertible::Json(json_str.clone()),
        )
        .expect_err("nai mismatch in JSON must error");

    assert!(
        err.message().contains(HBD_NAI),
        "error should echo the offending JSON: {}",
        err.message()
    );
    assert!(err.message().to_lowercase().contains("cannot create asset"));
}

#[test]
fn create_asset_with_required_symbol_rejects_malformed_json() {
    let f = foundation();

    let err = f
        .create_asset_with_required_symbol(
            AssetName::Hive,
            NaiAssetConvertible::Json("not-valid-json".into()),
        )
        .expect_err("malformed JSON must error");

    assert!(err.message().contains("not-valid-json"));
}

#[test]
fn create_asset_with_required_symbol_rejects_json_missing_fields() {
    let f = foundation();

    let err = f
        .create_asset_with_required_symbol(
            AssetName::Hive,
            NaiAssetConvertible::Json("{\"amount\":\"1000\"}".into()),
        )
        .expect_err("JSON missing precision/nai must error");

    assert!(
        err.message().contains("1000"),
        "error should echo the offending JSON: {}",
        err.message()
    );
}

// ---------- get_asset --------------------------------------------------------

#[test]
fn get_asset_returns_symbol_and_decimal_amount_for_hive() {
    let f = foundation();

    // 1000 satoshi @ precision 3 → "1.000" HIVE.
    let asset = json("1000", ASSET_PRECISION, HIVE_NAI);
    let data = f.get_asset(&asset).expect("get_asset");

    assert_eq!(
        data,
        HiveAssetData {
            amount: "1.000".into(),
            symbol: "HIVE".into(),
        }
    );
}

#[test]
fn get_asset_returns_symbol_and_decimal_amount_for_hbd() {
    let f = foundation();

    // 1500 satoshi @ precision 3 → "1.500" HBD (legacy hived prints HBD as
    // "SBD" for that asset_num — guard against that here).
    let asset = json("1500", ASSET_PRECISION, HBD_NAI);
    let data = f.get_asset(&asset).expect("get_asset");

    assert_eq!(data.amount, "1.500");
    assert!(
        data.symbol == "HBD" || data.symbol == "SBD",
        "expected HBD/SBD symbol from legacy_asset, got '{}'",
        data.symbol
    );
}

#[test]
fn get_asset_returns_six_decimal_amount_for_vests() {
    let f = foundation();

    // 1_234_567 satoshi @ precision 6 → "1.234567" VESTS.
    let asset = json("1234567", VESTS_PRECISION, VESTS_NAI);
    let data = f.get_asset(&asset).expect("get_asset");

    assert_eq!(data.amount, "1.234567");
    assert_eq!(data.symbol, "VESTS");
}

#[test]
fn get_asset_round_trips_amount_from_hive_constructor() {
    // Sanity: a NaiAsset produced by `hive_satoshis` must parse back to the
    // same numeric value via `get_asset`.
    let f = foundation();

    let asset = f.hive_satoshis(2_500).expect("hive_satoshis");
    let data = f.get_asset(&asset).expect("get_asset");

    assert_eq!(data.amount, "2.500");
    assert_eq!(data.symbol, "HIVE");
}

#[test]
fn get_asset_errors_on_malformed_nai() {
    // A malformed NAI string (bad check digit) must surface as an FFI error
    // rather than silently masking a corrupt asset.
    let f = foundation();

    let asset = json("1000", ASSET_PRECISION, "@@000000099");
    let err = f.get_asset(&asset).expect_err("malformed nai must error");

    assert!(
        !err.message().is_empty(),
        "error should not be empty: {}",
        err.message()
    );
}
