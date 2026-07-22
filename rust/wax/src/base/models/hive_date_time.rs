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

    /// Converts a timestamp string into a [`HiveDateTime`]. Accepts the Hive
    /// wire format (`2025-07-08T12:34:57`), RFC 3339 (`Z` / offset suffix,
    /// fractional seconds) and unix epoch seconds (`1751977457`).
    pub fn parse(value: &str) -> Result<Self, WaxError> {
        if let Ok(naive) =
            NaiveDateTime::parse_from_str(value, HIVE_TIME_FORMAT)
        {
            return Ok(Self(naive.and_utc()));
        }
        if let Ok(date_time) = DateTime::parse_from_rfc3339(value) {
            return Ok(Self(date_time.with_timezone(&Utc)));
        }
        if let Ok(seconds) = value.parse::<i64>() {
            return Self::from_timestamp(seconds);
        }

        Err(WaxError::new(format!(
            "Date must be in format {HIVE_TIME_FORMAT}, RFC 3339 or unix \
             epoch seconds"
        )))
    }

    /// Converts unix epoch seconds into a [`HiveDateTime`].
    pub fn from_timestamp(seconds: i64) -> Result<Self, WaxError> {
        DateTime::from_timestamp(seconds, 0)
            .map(Self)
            .ok_or_else(|| {
                WaxError::new(format!(
                    "Unix timestamp {seconds} exceeds the supported date range"
                ))
            })
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

// Serde speaks Hive's wire format ("%Y-%m-%dT%H:%M:%S"), matching how the
// chain APIs emit and accept timestamps.

impl serde::Serialize for HiveDateTime {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.collect_str(self)
    }
}

impl<'de> serde::Deserialize<'de> for HiveDateTime {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;

        Self::parse(&value).map_err(serde::de::Error::custom)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn serde_round_trips_wire_format() {
        let json = "\"2025-07-08T12:34:57\"";
        let value: HiveDateTime = serde_json::from_str(json).unwrap();

        assert_eq!(serde_json::to_string(&value).unwrap(), json);
    }

    #[test]
    fn serde_rejects_malformed_timestamps() {
        assert!(
            serde_json::from_str::<HiveDateTime>("\"2025-07-08\"").is_err()
        );
    }

    #[test]
    fn parse_accepts_rfc3339_timestamps() {
        let wire = HiveDateTime::parse("2025-07-08T12:34:57").unwrap();

        assert_eq!(HiveDateTime::parse("2025-07-08T12:34:57Z").unwrap(), wire);
        assert_eq!(
            HiveDateTime::parse("2025-07-08T14:34:57.000+02:00").unwrap(),
            wire
        );
    }

    #[test]
    fn parse_accepts_unix_epoch_seconds() {
        let wire = HiveDateTime::parse("2025-07-08T12:34:57").unwrap();
        let epoch = wire.inner().timestamp().to_string();

        assert_eq!(HiveDateTime::parse(&epoch).unwrap(), wire);
    }

    #[test]
    fn parse_rejects_out_of_range_epoch_seconds() {
        assert!(HiveDateTime::parse(&i64::MAX.to_string()).is_err());
    }
}
