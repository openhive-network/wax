# Published as registry.gitlab.syncad.com/hive/wax/wax-rust-aidev-tests:${WAX_RUST_AIDEV_TESTS_IMAGE_TAG}
# by the build_wax_rust_aidev_tests_image job; build context is rust/.
#
# The image AIDEV runs .aidev/run-rust.sh in, with --network none: wax-rust-builder
# plus everything the build and the `detailed` suite would otherwise download.
#   /opt/wax-aidev/cargo-home         CARGO_HOME with every crate Cargo.lock and
#                                     proto_builder/Cargo.lock pin
#   /opt/wax-aidev/beekeeper          the hiveio-beekeeper crate Cargo.lock pins,
#                                     as fetch_beekeeper.sh unpacks it
#   /opt/wax-aidev/cargo-lock.sha256  the lock files the above was fetched for;
#                                     run-rust.sh refuses to run against others
ARG WAX_RUST_BUILDER_IMAGE=registry.gitlab.syncad.com/hive/wax/wax-rust-builder:pypa_2_28-17-rust3
FROM ${WAX_RUST_BUILDER_IMAGE}

USER root

WORKDIR /opt/wax-aidev/src
COPY Cargo.toml Cargo.lock fetch_beekeeper.sh ./
COPY wax/Cargo.toml wax/
COPY wax_macros/Cargo.toml wax_macros/
COPY signers/beekeeper/Cargo.toml signers/beekeeper/
COPY proto_builder/Cargo.toml proto_builder/Cargo.lock proto_builder/

# cargo fetch only needs each package to have a target, not its sources.
# The suite runs as the host user, so the cargo home stays writable for any uid
# (cargo locks it even offline), and the builder's toolchain under /home/user
# must be reachable for a uid other than the builder's.
RUN set -e && \
    for d in wax wax_macros signers/beekeeper; do mkdir -p "$d/src" && touch "$d/src/lib.rs"; done && \
    mkdir -p proto_builder/src && echo 'fn main() {}' > proto_builder/src/main.rs && \
    BEEKEEPER_VERSION=$(sed -n '/^name = "hiveio-beekeeper"$/{n;s/^version = "\(.*\)"$/\1/p}' Cargo.lock) && \
    test -n "${BEEKEEPER_VERSION}" && \
    BEEKEEPER_VERSION="${BEEKEEPER_VERSION}" ./fetch_beekeeper.sh && \
    export CARGO_HOME=/opt/wax-aidev/cargo-home && \
    cargo fetch --locked && \
    (cd proto_builder && cargo fetch --locked) && \
    mv crates/hiveio-beekeeper /opt/wax-aidev/beekeeper && \
    sha256sum Cargo.lock proto_builder/Cargo.lock > /opt/wax-aidev/cargo-lock.sha256 && \
    cd / && rm -rf /opt/wax-aidev/src && \
    chmod -R a+rX /opt/wax-aidev && chmod -R a+w /opt/wax-aidev/cargo-home && \
    chmod a+x /home/*

WORKDIR /
