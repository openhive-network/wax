#!/bin/bash
set -ex

# This script installs all build dependencies required for wax wheel build.
# It expects the following environment variables to be set:
#   WAX_BOOST_ROOT   - Installation path for Boost
#   WAX_OPENSSL_ROOT - Installation path for OpenSSL
#   WAX_ZLIB_ROOT    - Installation path for zlib
#   WAX_BZIP2_ROOT   - Installation path for bzip2
#
# Optional arguments (with defaults):
#   BOOST_VERSION_TAG   - Boost version tag (default: boost-1.83.0)
#   OPENSSL_VERSION     - OpenSSL version (default: openssl-3.0.16)
#   ZLIB_VERSION        - zlib version (default: 1.3.1)
#   BZIP2_VERSION       - bzip2 version (default: 1.0.8)

BOOST_VERSION_TAG="${BOOST_VERSION_TAG:-boost-1.83.0}"
OPENSSL_VERSION="${OPENSSL_VERSION:-openssl-3.0.16}"
ZLIB_VERSION="${ZLIB_VERSION:-1.3.1}"
BZIP2_VERSION="${BZIP2_VERSION:-1.0.8}"

# Verify required environment variables
for var in WAX_BOOST_ROOT WAX_OPENSSL_ROOT WAX_ZLIB_ROOT WAX_BZIP2_ROOT; do
    if [ -z "${!var}" ]; then
        echo "ERROR: Required environment variable $var is not set"
        exit 1
    fi
done

echo "=== Installing build dependencies for wax ==="
echo "Boost version: ${BOOST_VERSION_TAG} -> ${WAX_BOOST_ROOT}"
echo "OpenSSL version: ${OPENSSL_VERSION} -> ${WAX_OPENSSL_ROOT}"
echo "zlib version: ${ZLIB_VERSION} -> ${WAX_ZLIB_ROOT}"
echo "bzip2 version: ${BZIP2_VERSION} -> ${WAX_BZIP2_ROOT}"

# Install system packages via dnf
echo "=== Installing system packages ==="
dnf install -y \
    perl-IPC-Cmd \
    perl-Digest-SHA \
    gdb \
    ninja-build \
    cmake \
    zlib-devel \
    bzip2-devel \
    ncurses-devel \
    readline-devel \
    vim-common

# Build and install Boost
echo "=== Building Boost ==="
TMP_SRC=/tmp/boost_src
mkdir -p "${TMP_SRC}"
cd "${TMP_SRC}"
git clone --recurse-submodules --shallow-submodules --single-branch --depth=1 --branch "${BOOST_VERSION_TAG}" https://github.com/boostorg/boost.git
cd "${TMP_SRC}/boost"
./bootstrap.sh --without-icu --prefix="${WAX_BOOST_ROOT}"
./b2 \
    --build-dir="${TMP_SRC}/boost_build/" \
    --prefix="${WAX_BOOST_ROOT}" \
    -j "$(nproc)" \
    -q \
    cxxflags=-fPIC \
    runtime-link=static \
    link=static \
    threading=multi \
    --with-chrono \
    --with-context \
    --with-coroutine \
    --with-filesystem \
    --with-system \
    --with-thread \
    --with-test \
    install
rm -rf "${TMP_SRC}"

# Build and install OpenSSL with static libraries
echo "=== Building OpenSSL ==="
TMP_SRC=/tmp/openssl_src
mkdir -p "${TMP_SRC}"
cd "${TMP_SRC}"
curl -LO "https://github.com/openssl/openssl/releases/download/${OPENSSL_VERSION}/${OPENSSL_VERSION}.tar.gz"
tar xzf "${OPENSSL_VERSION}.tar.gz"
cd "${OPENSSL_VERSION}"
./config \
    --prefix="${WAX_OPENSSL_ROOT}" \
    --openssldir="${WAX_OPENSSL_ROOT}" \
    no-shared \
    -fPIC
make -j "$(nproc)"
make install_sw
rm -rf "${TMP_SRC}"

# Build and install zlib with static library
echo "=== Building zlib ==="
TMP_SRC=/tmp/zlib_src
mkdir -p "${TMP_SRC}"
cd "${TMP_SRC}"
curl -LO "https://zlib.net/zlib-${ZLIB_VERSION}.tar.gz"
tar xzf "zlib-${ZLIB_VERSION}.tar.gz"
cd "zlib-${ZLIB_VERSION}"
CFLAGS="-fPIC" ./configure \
    --prefix="${WAX_ZLIB_ROOT}" \
    --static
make -j "$(nproc)"
make install
rm -rf "${TMP_SRC}"

# Build and install bzip2 with static library
echo "=== Building bzip2 ==="
TMP_SRC=/tmp/bzip2_src
mkdir -p "${TMP_SRC}"
cd "${TMP_SRC}"
curl -LO "https://sourceware.org/pub/bzip2/bzip2-${BZIP2_VERSION}.tar.gz"
tar xzf "bzip2-${BZIP2_VERSION}.tar.gz"
cd "bzip2-${BZIP2_VERSION}"
make -j "$(nproc)" CFLAGS="-fPIC -O2"
make install PREFIX="${WAX_BZIP2_ROOT}"
rm -rf "${TMP_SRC}"

# Build and install zopfli (not available in AlmaLinux repos)
echo "=== Building zopfli ==="
TMP_ZOPFLI=/tmp/zopfli_src
mkdir -p "${TMP_ZOPFLI}"
cd "${TMP_ZOPFLI}"
curl -LO "https://github.com/google/zopfli/archive/refs/tags/zopfli-1.0.3.tar.gz"
tar xzf zopfli-1.0.3.tar.gz
cd zopfli-zopfli-1.0.3
make -j "$(nproc)" zopfli
cp zopfli /usr/local/bin/
rm -rf "${TMP_ZOPFLI}"

# Return to a valid directory before installing Python packages
cd /tmp

# Install Python packages using Python 3.12 (some tools don't support Python 3.14 yet)
echo "=== Installing Python packages ==="
/opt/python/cp312-cp312/bin/pip install poetry==2.2.0 grpcio-tools mypy-protobuf
# Create symlink for poetry so it's available in PATH
ln -sf /opt/python/cp312-cp312/bin/poetry /usr/local/bin/poetry

# Install Node.js via nvm
echo "=== Installing Node.js ==="
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="/root/.nvm"
. "$NVM_DIR/nvm.sh"
nvm install --lts
NODE_DIR=$(find /root/.nvm/versions/node -maxdepth 1 -type d -name "v*" | head -1)
cp -r "$NODE_DIR/bin/"* /usr/local/bin/
cp -r "$NODE_DIR/lib/"* /usr/local/lib/
cp -r "$NODE_DIR/include/"* /usr/local/include/
cp -r "$NODE_DIR/share/"* /usr/local/share/
npm install -g pnpm typescript tsx

echo "=== Build dependencies installation complete ==="
