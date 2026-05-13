use wax::RustAsset;

#[test]
fn hive_satoshis_uses_canonical_nai_and_precision() {
    let asset = RustAsset::hive(100_000).into_proto();
    assert_eq!(asset.amount, "100000");
    assert_eq!(asset.precision, 3);
    assert_eq!(asset.nai, "@@000000021");
}

#[test]
fn hbd_satoshis_uses_canonical_nai_and_precision() {
    let asset = RustAsset::hbd(42).into_proto();
    assert_eq!(asset.amount, "42");
    assert_eq!(asset.precision, 3);
    assert_eq!(asset.nai, "@@000000013");
}

#[test]
fn vests_satoshis_uses_canonical_nai_and_precision() {
    let asset = RustAsset::vests(1_000_000).into_proto();
    assert_eq!(asset.amount, "1000000");
    assert_eq!(asset.precision, 6);
    assert_eq!(asset.nai, "@@000000037");
}

#[test]
fn negative_satoshis_are_supported() {
    let asset = RustAsset::hive(-1).into_proto();
    assert_eq!(asset.amount, "-1");
}

#[test]
fn from_proto_round_trips() {
    let original = RustAsset::hbd(7).into_proto();
    let wrapped = RustAsset::from_proto(original.clone());
    assert_eq!(wrapped.proto(), &original);
}
