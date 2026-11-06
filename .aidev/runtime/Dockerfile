# The one image AIDEV runs every wax suite in (ts, rust and python), with
# --network none. AIDEV builds it itself: BASE_IMAGE is the digest the followed
# `environment.base` tag of .aidev/project.yaml names now (the emsdk image CI
# builds the TypeScript package with), and a change to this file or to any
# `environment.inputs` file rebuilds it on the next run. The build context is the
# checkout, narrowed by Dockerfile.dockerignore to the files copied below; every
# one of them that decides what is baked must be listed in `environment.inputs`.
# See .aidev/README.md.
#
# The base provides emscripten, cmake, ninja, protoc, Boost for wasm, ccc's Node
# and pnpm, Playwright's chromium, gcc and sccache. This adds:
#   /usr/local/bin/sccache          sccache 0.19.0 when the base's is older than 0.14
#   /opt/pnpm-store, /opt/corepack  `pnpm fetch` of ts/pnpm-lock.yaml and the
#                                   `packageManager` pnpm (ts suite, python's mock server)
#   /wax_boost_root                 static Boost as CI's ci-base-image builds it
#                                   (prepare_boost.sh), for the native rust and python builds
#   /usr/local/lib/lib{ssl,crypto,z,bz2}.a  the static libraries python/wax/CMakeLists.txt
#                                   links by those paths
#   /opt/rust                       rustup's stable toolchain
#   /opt/python, python3.12,        the latest CPython 3.12 and 3.14
#     python3.14                    (python-build-standalone)
#   /opt/wax-aidev/cargo-home       CARGO_HOME with every crate rust/Cargo.lock and
#                                   rust/proto_builder/Cargo.lock pin
#   /opt/wax-aidev/beekeeper        the hiveio-beekeeper crate rust/Cargo.lock pins, as
#                                   fetch_beekeeper.sh unpacks it
#   /opt/wax-aidev/venv-wax         Python 3.12 venv: `poetry install --no-root` of
#                                   python/wax/poetry.lock, its [build-system] requires, pytest
#   /opt/wax-aidev/venv-test-tools  the same for python/test_tools/poetry.lock without
#                                   hiveio-wax, as CI's .test_tools_test_env does
#   /opt/wax-aidev/venv-wax-3.14,   the same two on Python 3.14 (the 3.12 venvs keep
#     venv-test-tools-3.14          the names they had before 3.14 was added)
#   /opt/wax-aidev/venv-pre-commit-3.14  pre_commit_checks' Python 3.14 environment:
#                                   wax's dependencies with its static-analysis group
#                                   (mypy, ruff, pre-commit), test-tools' without
#                                   hiveio-wax, test-tools' build requires, pytest
#   /opt/wax-aidev/pre-commit-home  PRE_COMMIT_HOME: the hook environments of
#                                   python/.pre-commit-config.yaml, writable by any uid
ARG BASE_IMAGE

FROM ${BASE_IMAGE} AS boost
SHELL ["/bin/bash", "-c"]
ARG BOOST_VERSION_TAG=boost-1.90.0
USER root
COPY python/wax/scripts/prepare_boost.sh /tmp/prepare_boost.sh
RUN set -e && mkdir -p /tmp/boost-src && cd /tmp/boost-src \
    && curl -fSL "https://github.com/boostorg/boost/releases/download/${BOOST_VERSION_TAG}/${BOOST_VERSION_TAG}-b2-nodocs.tar.gz" | tar xz \
    && mv "${BOOST_VERSION_TAG}" boost \
    && bash /tmp/prepare_boost.sh /tmp/boost-src /wax_boost_root

FROM ${BASE_IMAGE}
SHELL ["/bin/bash", "-c"]
ARG RUST_TOOLCHAIN=stable
ARG POETRY_VERSION=2.1.3
ARG PYTHON_TEST_TOOLS_IMAGE=registry.gitlab.syncad.com/hive/common-ci-configuration/python-test-tools:develop

# CI runs `nvm use $NODEJS_VERSION` first, which puts nvm's Node bin dir (and its
# pnpm) in front of emsdk's own older Node; do the same without nvm.
# That pnpm is a corepack shim: pnpm from package.json `packageManager` is installed
# into COREPACK_HOME at build time, so it resolves offline. Suites run as the
# caller's uid, so HOME is /tmp and the shared state is world-writable.
# BOOST_ROOT is left unset: the wasm build must find the emscripten sysroot's Boost.
ENV PATH=/home/emscripten/.nvm/versions/node/${NODEJS_VERSION}/bin:/home/emscripten/.local/share/pnpm:/emsdk:/emsdk/upstream/emscripten:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/rust/cargo/bin \
    HOME=/tmp \
    COREPACK_HOME=/opt/corepack \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    COREPACK_ENABLE_NETWORK=0 \
    npm_config_store_dir=/opt/pnpm-store \
    HUSKY=0 \
    DO_NOT_TRACK=1 \
    WAX_AIDEV=/opt/wax-aidev \
    WAX_BOOST_ROOT=/wax_boost_root/ \
    RUSTUP_HOME=/opt/rust/rustup \
    CARGO_HOME=/opt/wax-aidev/cargo-home \
    PRE_COMMIT_HOME=/opt/wax-aidev/pre-commit-home \
    PYTHON_KEYRING_BACKEND=keyring.backends.null.Keyring

USER root
RUN set -e && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        libssl-dev libbz2-dev zlib1g-dev libreadline-dev libncurses-dev pkg-config xxd \
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    && multiarch="$(gcc -print-multiarch)" \
    && for lib in libssl.a libcrypto.a libz.a libbz2.a; do ln -s "/usr/lib/${multiarch}/${lib}" "/usr/local/lib/${lib}"; done
# .aidev/compiler-cache.sh needs sccache 0.14 or later: older ones ignore
# SCCACHE_BASEDIRS, and before 0.10 they never hit the site WebDAV caches (they stat
# each key with PROPFIND, the caches answer every PROPFIND as a collection, and they
# then read nothing). The base's is used when it is new enough (emsdk 5.0.2-15 ships
# 0.19.0); an older base (5.0.2-10 ships 0.8.1) gets this release over it.
ARG SCCACHE_VERSION=0.19.0
ARG SCCACHE_SHA256=aa73c7270c997894038c0d8f0d297865f57569e1687883322bc431713d4bb9dd
RUN set -e && at_least_0_14() { local v; v="$(sccache --version 2>/dev/null)" && v="${v#sccache }" \
        && [ "$(printf '%s\n' 0.14.0 "$v" | sort -V | head -n1)" = 0.14.0 ]; } \
    && if ! at_least_0_14; then \
        dist="sccache-v${SCCACHE_VERSION}-x86_64-unknown-linux-musl" \
        && curl -fSL -o /tmp/sccache.tar.gz "https://github.com/mozilla/sccache/releases/download/v${SCCACHE_VERSION}/${dist}.tar.gz" \
        && echo "${SCCACHE_SHA256}  /tmp/sccache.tar.gz" | sha256sum -c - \
        && tar -xzf /tmp/sccache.tar.gz -C /tmp "${dist}/sccache" \
        && install -m 0755 "/tmp/${dist}/sccache" /usr/local/bin/sccache \
        && rm -rf /tmp/sccache.tar.gz "/tmp/${dist}" \
        && test "$(sccache --version)" = "sccache ${SCCACHE_VERSION}"; \
    fi \
    && at_least_0_14
RUN set -e && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
        | CARGO_HOME=/opt/rust/cargo sh -s -- -y --no-modify-path --profile minimal --default-toolchain "${RUST_TOOLCHAIN}" \
    && chmod -R a+rX /opt/rust
# The base's Python is Ubuntu's 3.12.3, whose typing.get_type_hints cannot resolve
# hiveio-api's PEP 695 generics; CI's ci-base-image has a current 3.12. python3.12
# and python3.14 (CI's other version) here are python-build-standalone's latest, as
# uv installs them.
RUN set -e && curl -LsSf https://astral.sh/uv/install.sh | UV_UNMANAGED_INSTALL=/tmp/uv sh \
    && UV_PYTHON_INSTALL_DIR=/opt/python /tmp/uv/uv python install 3.12 3.14 \
    && ln -s /opt/python/cpython-3.12.*/bin/python3.12 /usr/local/bin/python3.12 \
    && ln -s /opt/python/cpython-3.14.*/bin/python3.14 /usr/local/bin/python3.14 \
    && /usr/local/bin/python3.12 -c 'import sys; assert sys.version_info[:2] == (3, 12) and sys.version_info[2] > 3' \
    && /usr/local/bin/python3.14 -c 'import sys; assert sys.version_info[:2] == (3, 14)' \
    && rm -rf /tmp/uv /tmp/.cache /tmp/.local && chmod -R a+rX /opt/python
RUN set -e && python3.12 -m venv /opt/poetry \
    && /opt/poetry/bin/pip install --no-cache-dir "poetry==${POETRY_VERSION}" \
    && ln -s /opt/poetry/bin/poetry /usr/local/bin/poetry
COPY --from=boost /wax_boost_root /wax_boost_root

COPY ts/package.json ts/pnpm-lock.yaml /tmp/pnpm-fetch/
COPY ts/npm-common-config/pnpm-config/pnpm-workspace.yaml ts/npm-common-config/pnpm-config/.npmrc /tmp/pnpm-fetch/
RUN cd /tmp/pnpm-fetch \
    && COREPACK_ENABLE_NETWORK=1 corepack install -g "$(node -p "require('./package.json').packageManager")" \
    && test "pnpm@$(pnpm --version)" = "$(node -p "require('./package.json').packageManager.split('+')[0]")" \
    && pnpm fetch \
    && cd / && rm -rf /tmp/pnpm-fetch /tmp/.cache /tmp/.local \
    && chmod -R a+rwX /opt/pnpm-store /opt/corepack

# cargo fetch only needs each package to have a target, not its sources. cargo
# locks the cargo home even offline, so it stays writable for any uid.
WORKDIR /opt/wax-aidev/src/rust
COPY rust/Cargo.toml rust/Cargo.lock rust/fetch_beekeeper.sh ./
COPY rust/wax/Cargo.toml wax/
COPY rust/wax_macros/Cargo.toml wax_macros/
COPY rust/signers/beekeeper/Cargo.toml signers/beekeeper/
COPY rust/proto_builder/Cargo.toml rust/proto_builder/Cargo.lock proto_builder/
RUN set -e && \
    for d in wax wax_macros signers/beekeeper; do mkdir -p "$d/src" && touch "$d/src/lib.rs"; done && \
    mkdir -p proto_builder/src && echo 'fn main() {}' > proto_builder/src/main.rs && \
    BEEKEEPER_VERSION=$(sed -n '/^name = "hiveio-beekeeper"$/{n;s/^version = "\(.*\)"$/\1/p}' Cargo.lock) && \
    test -n "${BEEKEEPER_VERSION}" && \
    BEEKEEPER_VERSION="${BEEKEEPER_VERSION}" ./fetch_beekeeper.sh && \
    cargo fetch --locked && \
    (cd proto_builder && cargo fetch --locked) && \
    mv crates/hiveio-beekeeper /opt/wax-aidev/beekeeper && \
    cd / && rm -rf /opt/wax-aidev/src/rust && \
    chmod -R a+rX /opt/wax-aidev && chmod -R a+w /opt/wax-aidev/cargo-home

# poetry-dynamic-versioning in Poetry's own environment satisfies
# [tool.poetry.requires-plugins], so poetry does not install it per project; it
# would read git tags, and the context is no repository.
WORKDIR /opt/wax-aidev/src
COPY python/wax/pyproject.toml python/wax/poetry.lock python/wax/
COPY python/wax/tests/wax-local-tools python/wax/tests/wax-local-tools/
COPY python/test_tools/pyproject.toml python/test_tools/poetry.lock python/test_tools/readme.md python/test_tools/
COPY python/.pre-commit-config.yaml python/
COPY ts/npm-common-config/scripts/python/python-test-tools-constraints.py ts/npm-common-config/scripts/python/registry_auth.py ccc/
# CI sets PYO3_USE_ABI3_FORWARD_COMPATIBILITY for every job (3.14 installs need it).
# pre_commit_checks runs on 3.14 in one environment holding both projects'
# dependencies; its hook environments come from GitHub, and pre-commit installs
# them only in a git repository.
RUN set -e && \
    plugin=$(python3.12 -c 'import sys, tomllib; d = tomllib.load(open(sys.argv[1], "rb"))["tool"]["poetry"]["requires-plugins"]["poetry-dynamic-versioning"]; print("poetry-dynamic-versioning[" + ",".join(d["extras"]) + "]==" + d["version"])' python/wax/pyproject.toml) && \
    poetry self add "${plugin}" && \
    python3.12 ccc/python-test-tools-constraints.py "${PYTHON_TEST_TOOLS_IMAGE}" /opt/wax-aidev/python-test-tools-constraints.txt && \
    export POETRY_DYNAMIC_VERSIONING_BYPASS=0.0.0 PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 && \
    build_requires() { python3.12 -c 'import sys, tomllib; print("\n".join(tomllib.load(open(sys.argv[1], "rb"))["build-system"]["requires"]))' "$1"; } && \
    poetry -C python/test_tools remove --lock -- hiveio-wax && \
    for version in 3.12 3.14; do \
        tag="-${version}"; \
        [ "${version}" != 3.12 ] || tag=""; \
        for project in wax test_tools; do \
            venv="/opt/wax-aidev/venv-${project//_/-}${tag}"; \
            "python${version}" -m venv "${venv}"; \
            ( \
                set -e; \
                source "${venv}/bin/activate"; \
                poetry -C "python/${project}" install --no-root; \
                mapfile -t requires < <(build_requires "python/${project}/pyproject.toml"); \
                python3 -m pip install "${requires[@]}"; \
                python3 -m pip install -c /opt/wax-aidev/python-test-tools-constraints.txt pytest pytest-asyncio pytest-xdist; \
            ) || exit 1; \
        done; \
    done && \
    ( \
        set -e; \
        venv=/opt/wax-aidev/venv-pre-commit-3.14; \
        python3.14 -m venv "${venv}"; \
        source "${venv}/bin/activate"; \
        poetry -C python/wax install --no-root; \
        poetry -C python/test_tools install --no-root; \
        mapfile -t requires < <(build_requires python/test_tools/pyproject.toml); \
        python3 -m pip install "${requires[@]}"; \
        python3 -m pip install -c /opt/wax-aidev/python-test-tools-constraints.txt pytest pytest-asyncio pytest-xdist; \
        mkdir /tmp/hooks; \
        cp python/.pre-commit-config.yaml /tmp/hooks/; \
        cd /tmp/hooks; \
        git init -q; \
        pre-commit install-hooks --config .pre-commit-config.yaml; \
        rm -rf /tmp/hooks; \
    ) && \
    cd / && rm -rf /opt/wax-aidev/src /tmp/.cache /tmp/.local /tmp/.config && \
    chmod -R a+rwX /opt/wax-aidev /opt/poetry

WORKDIR /
USER emscripten
