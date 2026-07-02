use crate::core::proto;

const HIVE_NAI: &str = "@@000000021";
const HBD_NAI: &str = "@@000000013";
const VESTS_NAI: &str = "@@000000037";

const HIVE_PRECISION: u32 = 3;
const HBD_PRECISION: u32 = 3;
const VESTS_PRECISION: u32 = 6;

/// Represents a Hive asset (an amount, its precision and its NAI symbol),
/// wrapping the generated [`proto::Asset`].
pub struct RustAsset {
    pub inner: proto::Asset,
}

impl RustAsset {
    /// Creates a HIVE-denominated asset from an amount in satoshis.
    pub fn hive(satoshis: i64) -> Self {
        Self::new(satoshis, HIVE_PRECISION, HIVE_NAI)
    }

    /// Creates an HBD-denominated asset from an amount in satoshis.
    pub fn hbd(satoshis: i64) -> Self {
        Self::new(satoshis, HBD_PRECISION, HBD_NAI)
    }

    /// Creates a VESTS-denominated asset from an amount in satoshis.
    pub fn vests(satoshis: i64) -> Self {
        Self::new(satoshis, VESTS_PRECISION, VESTS_NAI)
    }

    /// Wraps an existing [`proto::Asset`].
    pub fn from_proto(inner: proto::Asset) -> Self {
        Self { inner }
    }

    /// Returns a reference to the wrapped [`proto::Asset`].
    pub fn proto(&self) -> &proto::Asset {
        &self.inner
    }

    /// Consumes the wrapper and returns the inner [`proto::Asset`].
    pub fn into_proto(self) -> proto::Asset {
        self.inner
    }

    fn new(amount: i64, precision: u32, nai: &str) -> Self {
        Self {
            inner: proto::Asset {
                amount: amount.to_string(),
                precision,
                nai: nai.into(),
            },
        }
    }
}
