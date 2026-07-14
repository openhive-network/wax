//! Endpoint resolution shared by the JSON-RPC and REST transports: a
//! caller-wide default URL plus per-namespace overrides.

use std::sync::Mutex;

/// Represents the endpoint configuration of one transport: the caller-wide
/// default URL plus per-namespace-path overrides, the deepest matching
/// prefix winning.
///
/// TS NOTE: `ApiCaller.defaultEndpointUrl` plus the `endpointUrl` keys TS
/// scatters across the `localTypes` tree (`getEndpointUrlForRestApi` /
/// `setEndpointUrlForPath` serve both transports there too); the Rust port
/// keeps a flat prefix list instead.
pub(crate) struct EndpointResolver {
    /// TS NOTE: `defaultEndpointUrl`. Mutable behind a shared reference so
    /// an endpoint change on the chain is reflected by API handles already
    /// handed out, like the live TS proxy.
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
    ///
    /// TS NOTE: `setEndpointUrlForPath`. Clearing diverges: TS pins the
    /// *current* `defaultEndpointUrl` into the path, so a later default
    /// change no longer reaches it; the Rust port removes the override, so
    /// the path follows the live default again.
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
    ///
    /// TS NOTE: `getEndpointUrlForRestApi` — TS walks the `localTypes` tree
    /// keeping the deepest `endpointUrl` seen on the way; the flat
    /// equivalent is the longest matching prefix.
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

    // TS NOTE: mirrors the per-path `endpointUrl` semantics asserted in
    // `hive_chain_rest_api.ts` ('extended.restApi.a.endpointUrl = url1;
    // extended.restApi.a.b.endpointUrl = url2') — the deepest override wins
    // and siblings fall back to the shallower one.
    #[test]
    fn resolves_longest_matching_override() {
        let resolver = resolver();

        resolver.set_url_for_path(&["a"], Some("http://a".into()));
        resolver.set_url_for_path(&["a", "b"], Some("http://ab".into()));

        assert_eq!(resolver.resolve(&["a", "b", "c"]), "http://ab");
        assert_eq!(resolver.resolve(&["a", "x"]), "http://a");
        assert_eq!(resolver.resolve(&["z"]), "http://default");
    }

    // TS NOTE: `chain.restApi.endpointUrl = url` — a root-level override
    // applies to every namespace of the transport.
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
