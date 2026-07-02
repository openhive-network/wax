use chrono::{DateTime, NaiveDateTime, Utc};

use crate::WaxError;
use crate::base::constants::HIVE_TIME_FORMAT;

/// Represents a UTC timestamp in Hive's wire format.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct HiveDateTime(DateTime<Utc>);

impl HiveDateTime {
    /// Creates a timestamp from a chrono [`DateTime<Utc>`].
    pub fn new(value: DateTime<Utc>) -> Self {
        Self(value)
    }

    /// Returns the current UTC time.
    pub fn now() -> Self {
        Self(Utc::now())
    }

    /// Converts a Hive-formatted timestamp string into a [`HiveDateTime`].
    pub fn parse(value: &str) -> Result<Self, WaxError> {
        let naive = NaiveDateTime::parse_from_str(value, HIVE_TIME_FORMAT)
            .map_err(|_| {
                WaxError::new(format!(
                    "Date must be in format {HIVE_TIME_FORMAT}"
                ))
            })?;
        Ok(Self(naive.and_utc()))
    }

    /// Converts the timestamp into its Hive wire-format string.
    pub fn serialize(&self) -> String {
        self.0.format(HIVE_TIME_FORMAT).to_string()
    }

    /// Returns the wrapped chrono [`DateTime<Utc>`].
    pub fn inner(&self) -> DateTime<Utc> {
        self.0
    }
}

impl From<DateTime<Utc>> for HiveDateTime {
    fn from(value: DateTime<Utc>) -> Self {
        Self(value)
    }
}

impl AsRef<DateTime<Utc>> for HiveDateTime {
    fn as_ref(&self) -> &DateTime<Utc> {
        &self.0
    }
}

impl std::str::FromStr for HiveDateTime {
    type Err = WaxError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::parse(s)
    }
}

impl std::fmt::Display for HiveDateTime {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.serialize())
    }
}
