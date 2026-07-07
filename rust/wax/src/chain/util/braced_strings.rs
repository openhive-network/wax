//! `{param}` placeholder extraction for REST path templates.
//!
//! TS NOTE: ported from `extractBracedStrings` in
//! `ts/wasm/lib/detailed/rest-api/utils.ts`.

/// Extracts the `{...}`-delimited placeholder names from a path template.
///
/// TS NOTE: keeps the lenient TS scanning — an unterminated `{` ends the
/// scan without an error.
pub(super) fn extract_braced_strings(s: &str) -> Vec<&str> {
    let mut result = Vec::new();
    let mut rest = s;

    while let Some(start) = rest.find('{') {
        let Some(len) = rest[start + 1..].find('}') else {
            break;
        };

        result.push(&rest[start + 1..start + 1 + len]);
        rest = &rest[start + len + 2..];
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extracts_braced_strings() {
        assert_eq!(
            extract_braced_strings("/a/{first}/b/{second}"),
            vec!["first", "second"]
        );
        assert!(extract_braced_strings("/a/b").is_empty());
        // TS NOTE: lenient scanning — an unterminated brace ends the scan.
        assert_eq!(extract_braced_strings("/a/{x}/{oops"), vec!["x"]);
    }
}
