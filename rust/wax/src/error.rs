use std::fmt;

#[derive(Debug)]
pub struct WaxError {
    message: String,
}

impl WaxError {
    pub fn new(message: impl Into<String>) -> Self {
        Self { message: message.into() }
    }

    pub fn message(&self) -> &str {
        &self.message
    }
}

impl fmt::Display for WaxError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.message)
    }
}

impl std::error::Error for WaxError {}

impl From<cxx::Exception> for WaxError {
    fn from(value: cxx::Exception) -> Self {
        Self::new(value.what())
    }
}
