//! Endpoint resolution shared by the JSON-RPC and REST transports: a
//! caller-wide default URL plus per-namespace overrides.

use std::sync::Mutex;

/// Represents the endpoint configuration of one transport: the caller-wide
/// default URL plus per-namespace-path overrides, the deepest matching
/// prefix winning.
pub(crate) struct EndpointResolver {
    default: Mutex<String>,
    overrides: Mutex<Vec<EndpointOverride>>,
}

/// Represents a single per-namespace endpoint override: calls whose
/// namespace path starts with `path` are routed to `url`.
struct EndpointOverride {
    path: Vec<String>,
    url: String,
}

impl EndpointResolver {
    /// Creates a resolver routing everything to `default` until overrides
    /// are set.
    pub(crate) fn new(default: String) -> Self {
        Self {
            default: Mutex::new(default),
            overrides: Mutex::new(Vec::new()),
        }
    }

    /// Returns the caller-wide default endpoint URL.
    pub(crate) fn default_url(&self) -> String {
        self.default
            .lock()
            .expect("endpoint mutex poisoned")
            .clone()
    }

    /// Replaces the caller-wide default endpoint URL.
    pub(crate) fn set_default_url(&self, url: String) {
        *self.default.lock().expect("endpoint mutex poisoned") = url;
    }

    /// Sets (or clears with `None`) the endpoint override for the given
    /// namespace path; an empty path overrides every call of the transport.
    pub(crate) fn set_url_for_path(&self, path: &[&str], url: Option<String>) {
        let mut overrides =
            self.overrides.lock().expect("overrides mutex poisoned");

        overrides.retain(|o| o.path != path);

        if let Some(url) = url {
            overrides.push(EndpointOverride {
                path: path.iter().map(ToString::to_string).collect(),
                url,
            });
        }
    }

    /// Resolves the endpoint for a call: the deepest override whose path
    /// prefixes the namespace path, or the caller-wide default.
    pub(crate) fn resolve(&self, namespace_path: &[&str]) -> String {
        let overrides =
            self.overrides.lock().expect("overrides mutex poisoned");

        overrides
            .iter()
            .filter(|o| {
                o.path.len() <= namespace_path.len()
                    && o.path.iter().zip(namespace_path).all(|(a, b)| a == b)
            })
            .max_by_key(|o| o.path.len())
            .map(|o| o.url.clone())
            .unwrap_or_else(|| self.default_url())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn resolver() -> EndpointResolver {
        EndpointResolver::new("http://default".into())
    }

    #[test]
    fn resolves_longest_matching_override() {
        let resolver = resolver();

        resolver.set_url_for_path(&["a"], Some("http://a".into()));
        resolver.set_url_for_path(&["a", "b"], Some("http://ab".into()));

        assert_eq!(resolver.resolve(&["a", "b", "c"]), "http://ab");
        assert_eq!(resolver.resolve(&["a", "x"]), "http://a");
        assert_eq!(resolver.resolve(&["z"]), "http://default");
    }

    #[test]
    fn root_override_applies_to_every_path() {
        let resolver = resolver();

        resolver.set_url_for_path(&[], Some("http://root".into()));

        assert_eq!(resolver.resolve(&["any", "path"]), "http://root");
        assert_eq!(resolver.resolve(&[]), "http://root");
    }

    #[test]
    fn replaces_existing_override_for_same_path() {
        let resolver = resolver();

        resolver.set_url_for_path(&["a"], Some("http://old".into()));
        resolver.set_url_for_path(&["a"], Some("http://new".into()));

        assert_eq!(resolver.resolve(&["a"]), "http://new");
    }

    // Documents the intentional TS divergence: clearing an override follows
    // the live default instead of pinning the default current at clear time.
    #[test]
    fn clearing_override_restores_live_default() {
        let resolver = resolver();

        resolver.set_url_for_path(&["a"], Some("http://a".into()));
        resolver.set_url_for_path(&["a"], None);
        resolver.set_default_url("http://changed".into());

        assert_eq!(resolver.resolve(&["a"]), "http://changed");
    }
}
