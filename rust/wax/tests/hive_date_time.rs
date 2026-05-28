use std::str::FromStr;

use chrono::{TimeZone, Utc};
use wax::models::basic::{ChainReferenceData, HiveDateTime};

const CANONICAL: &str = "2026-05-15T12:34:56";

#[test]
fn parse_roundtrips_through_serialize() {
    let dt = HiveDateTime::parse(CANONICAL)
        .expect("parse should accept Hive format");
    assert_eq!(dt.serialize(), CANONICAL);
}

#[test]
fn from_str_matches_parse() {
    let from_parse = HiveDateTime::parse(CANONICAL).unwrap();
    let from_str = HiveDateTime::from_str(CANONICAL).unwrap();
    assert_eq!(from_parse, from_str);
}

#[test]
fn parse_rejects_non_hive_format() {
    // Same instant, wrong format (space instead of T) — must error.
    let err = HiveDateTime::parse("2026-05-15 12:34:56")
        .expect_err("space-separated must error");
    assert!(
        err.message().contains("%Y-%m-%dT%H:%M:%S"),
        "error should mention required format: {}",
        err.message()
    );
}

#[test]
fn parse_rejects_garbage() {
    assert!(HiveDateTime::parse("not-a-date").is_err());
    assert!(HiveDateTime::parse("").is_err());
}

#[test]
fn from_datetime_utc_normalizes_to_hive_format() {
    let utc = Utc.with_ymd_and_hms(2026, 5, 15, 12, 34, 56).unwrap();
    let dt: HiveDateTime = utc.into();
    assert_eq!(dt.serialize(), CANONICAL);
    assert_eq!(dt.inner(), utc);
}

#[test]
fn display_matches_serialize() {
    let dt = HiveDateTime::parse(CANONICAL).unwrap();
    assert_eq!(format!("{dt}"), CANONICAL);
}

#[test]
fn ordering_is_chronological() {
    let earlier = HiveDateTime::parse("2026-01-01T00:00:00").unwrap();
    let later = HiveDateTime::parse("2026-12-31T23:59:59").unwrap();
    assert!(earlier < later);
}

#[test]
fn now_serializes_to_hive_format() {
    let s = HiveDateTime::now().serialize();
    // Format check: exactly the shape produced by HIVE_TIME_FORMAT.
    assert_eq!(s.len(), 19);
    assert_eq!(&s[4..5], "-");
    assert_eq!(&s[7..8], "-");
    assert_eq!(&s[10..11], "T");
    assert_eq!(&s[13..14], ":");
    assert_eq!(&s[16..17], ":");
}

#[test]
fn chain_reference_data_construction() {
    let data = ChainReferenceData {
        time: HiveDateTime::parse(CANONICAL).unwrap(),
        head_block_id: "0123456789abcdef0123456789abcdef01234567".into(),
    };

    assert_eq!(data.time.serialize(), CANONICAL);
    assert!(!data.head_block_id.is_empty());
}
