use chrono::{DateTime, NaiveDateTime, Utc};

use crate::WaxError;
use crate::constants::HIVE_TIME_FORMAT;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct HiveDateTime(DateTime<Utc>);

impl HiveDateTime {
    pub fn new(value: DateTime<Utc>) -> Self {
        Self(value)
    }

    pub fn now() -> Self {
        Self(Utc::now())
    }

    pub fn parse(value: &str) -> Result<Self, WaxError> {
        let naive = NaiveDateTime::parse_from_str(value, HIVE_TIME_FORMAT)
            .map_err(|_| WaxError::new(format!("Date must be in format {HIVE_TIME_FORMAT}")))?;
        Ok(Self(naive.and_utc()))
    }

    pub fn serialize(&self) -> String {
        self.0.format(HIVE_TIME_FORMAT).to_string()
    }

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
