#!/bin/bash
set -e

CARGO_FLAGS=""
if [ "$1" = "release" ]; then
	CARGO_FLAGS="--release"
fi

cargo run -p proto-builder
cargo build ${CARGO_FLAGS} -p wax_core
cargo build ${CARGO_FLAGS} -p wax
