//! Shared wire-level fixtures for the request-layer tests: a single-shot HTTP
//! capture server and raw-request inspection helpers.
//!
//! TS NOTE: the TS tests observe outgoing requests through the `withProxy`
//! interceptor seam of `api_caller.ts`; the Rust port has no interceptors, so
//! the tests capture what was actually sent on the wire instead.

use std::io::{Read, Write};
use std::net::TcpListener;
use std::sync::mpsc;
use std::thread;

/// Serves a single request with a canned 200 JSON body, returning the
/// server URL and a receiver yielding the raw captured request.
pub fn spawn_capture_server(
    body: &'static str,
) -> (String, mpsc::Receiver<String>) {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let url = format!("http://{}", listener.local_addr().unwrap());
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let (mut stream, _) = listener.accept().unwrap();
        let mut raw = Vec::new();
        let mut buf = [0u8; 1024];

        let head_end = loop {
            let n = stream.read(&mut buf).unwrap();
            raw.extend_from_slice(&buf[..n]);

            if let Some(pos) = raw.windows(4).position(|w| w == b"\r\n\r\n") {
                break pos + 4;
            }
        };

        let head = String::from_utf8_lossy(&raw[..head_end]).to_lowercase();
        let content_length = head
            .lines()
            .find_map(|line| line.strip_prefix("content-length:"))
            .map_or(0, |value| value.trim().parse::<usize>().unwrap());

        while raw.len() < head_end + content_length {
            let n = stream.read(&mut buf).unwrap();
            raw.extend_from_slice(&buf[..n]);
        }

        let response = format!(
            "HTTP/1.1 200 OK\r\ncontent-type: application/json\r\n\
             content-length: {}\r\nconnection: close\r\n\r\n{body}",
            body.len(),
        );
        stream.write_all(response.as_bytes()).unwrap();

        tx.send(String::from_utf8_lossy(&raw).into_owned()).unwrap();
    });

    (url, rx)
}

/// Extracts a header value from the captured raw request; header names
/// are case-insensitive per HTTP.
pub fn header_value(raw: &str, name: &str) -> Option<String> {
    raw.lines()
        .take_while(|line| !line.is_empty())
        .find_map(|line| {
            let (key, value) = line.split_once(':')?;

            key.eq_ignore_ascii_case(name)
                .then(|| value.trim().to_string())
        })
}
