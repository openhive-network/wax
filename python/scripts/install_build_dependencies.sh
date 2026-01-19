#!/bin/bash
set -ex

# This script installs all build dependencies required for wax wheel build.
# It expects the following environment variables to be set:
#   WAX_BOOST_ROOT   - Installation path for Boost
#   WAX_OPENSSL_ROOT - Installation path for OpenSSL
#   WAX_ZLIB_ROOT    - Installation path for zlib
#   WAX_BZIP2_ROOT   - Installation path for bzip2
#   WAX_READLINE_ROOT - Installation path for readline
#   WAX_NCURSES_ROOT  - Installation path for ncurses
#   WAX_ICU_ROOT      - Installation path for ICU
#
# Optional arguments (with defaults):
#   BOOST_VERSION_TAG   - Boost version tag (default: boost-1.83.0)
#   OPENSSL_VERSION     - OpenSSL version (default: openssl-3.0.16)
#   ZLIB_VERSION        - zlib version (default: 1.3.1)
#   BZIP2_VERSION       - bzip2 version (default: 1.0.8)
#   READLINE_VERSION    - readline version (default: 8.2)
#   NCURSES_VERSION     - ncurses version (default: 6.4)
#   ICU_VERSION         - ICU version (default: 74-2)

BOOST_VERSION_TAG="${BOOST_VERSION_TAG:-boost-1.83.0}"
OPENSSL_VERSION="${OPENSSL_VERSION:-openssl-3.0.16}"
ZLIB_VERSION="${ZLIB_VERSION:-1.3.1}"
BZIP2_VERSION="${BZIP2_VERSION:-1.0.8}"
READLINE_VERSION="${READLINE_VERSION:-8.2}"
NCURSES_VERSION="${NCURSES_VERSION:-6.4}"
ICU_VERSION="${ICU_VERSION:-74-2}"

# Verify required environment variables
for var in WAX_BOOST_ROOT WAX_OPENSSL_ROOT WAX_ZLIB_ROOT WAX_BZIP2_ROOT WAX_READLINE_ROOT WAX_NCURSES_ROOT WAX_ICU_ROOT; do
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
echo "readline version: ${READLINE_VERSION} -> ${WAX_READLINE_ROOT}"
echo "ncurses version: ${NCURSES_VERSION} -> ${WAX_NCURSES_ROOT}"
echo "ICU version: ${ICU_VERSION} -> ${WAX_ICU_ROOT}"

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
    vim-common \
    liburing-devel \
    libicu-devel \
    sudo \
    boost-devel

# Build Snappy from source with proper cmake config
# (system snappy-devel doesn't create cmake imported targets)
echo "=== Building Snappy ==="
TMP_SRC=/tmp/snappy_src
mkdir -p "${TMP_SRC}"
cd "${TMP_SRC}"
curl -LO "https://github.com/google/snappy/archive/refs/tags/1.2.1.tar.gz"
tar xzf 1.2.1.tar.gz
cd snappy-1.2.1
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_POLICY_VERSION_MINIMUM=3.5 \
      -DCMAKE_INSTALL_PREFIX=/usr/local \
      -DSNAPPY_BUILD_TESTS=OFF \
      -DSNAPPY_BUILD_BENCHMARKS=OFF \
      -DBUILD_SHARED_LIBS=OFF \
      -DCMAKE_POSITION_INDEPENDENT_CODE=ON \
      ..
make -j "$(nproc)"
make install
rm -rf "${TMP_SRC}"

echo "user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Build and install ICU with static libraries (required for Boost locale static build)
echo "=== Building ICU ==="
TMP_SRC=/tmp/icu_src
mkdir -p "${TMP_SRC}"
cd "${TMP_SRC}"
# ICU version format: 74-2 -> release-74-2 tag
curl -LO "https://github.com/unicode-org/icu/releases/download/release-${ICU_VERSION}/icu4c-${ICU_VERSION//-/_}-src.tgz"
tar xzf "icu4c-${ICU_VERSION//-/_}-src.tgz"
cd icu/source
CFLAGS="-fPIC" CXXFLAGS="-fPIC" ./configure \
    --prefix="${WAX_ICU_ROOT}" \
    --enable-static \
    --disable-shared \
    --with-data-packaging=static
make -j "$(nproc)"
make install
rm -rf "${TMP_SRC}"

# Build and install Boost
echo "=== Building Boost ==="
TMP_SRC=/tmp/boost_src
mkdir -p "${TMP_SRC}"
cd "${TMP_SRC}"
git clone --recurse-submodules --shallow-submodules --single-branch --depth=1 --branch "${BOOST_VERSION_TAG}" https://github.com/boostorg/boost.git
cd "${TMP_SRC}/boost"
./bootstrap.sh --prefix="${WAX_BOOST_ROOT}"

# Verify ICU installation before Boost build
echo "Verifying ICU installation at ${WAX_ICU_ROOT}:"
ls -la "${WAX_ICU_ROOT}/lib/"
ls -la "${WAX_ICU_ROOT}/include/"

# Set environment variables for ICU detection (use custom static ICU)
export ICU_ROOT="${WAX_ICU_ROOT}"
export ICU_PATH="${WAX_ICU_ROOT}"
export LIBRARY_PATH="${WAX_ICU_ROOT}/lib:${LIBRARY_PATH:-}"
export CPLUS_INCLUDE_PATH="${WAX_ICU_ROOT}/include:${CPLUS_INCLUDE_PATH:-}"
export C_INCLUDE_PATH="${WAX_ICU_ROOT}/include:${C_INCLUDE_PATH:-}"

# Build boost locale library with ICU support
# Use runtime-link=shared to allow linking with ICU libraries (static or shared)
./b2 \
    --build-dir="${TMP_SRC}/boost_build/" \
    --prefix="${WAX_BOOST_ROOT}" \
    -j "$(nproc)" \
    cxxflags="-fPIC -I${WAX_ICU_ROOT}/include" \
    linkflags="-L${WAX_ICU_ROOT}/lib" \
    link=static \
    threading=multi \
    -sICU_PATH="${WAX_ICU_ROOT}" \
    boost.locale.icu=on \
    boost.locale.std=off \
    boost.locale.posix=off \
    boost.locale.winapi=off \
    --with-locale \
    --debug-configuration \
    -d+2 \
    install

# Verify the locale library was built
echo "Checking if libboost_locale was built:"
ls -la "${WAX_BOOST_ROOT}/lib/"*locale* || echo "WARNING: libboost_locale not found!"

# Build the rest of the boost libraries
./b2 \
    --build-dir="${TMP_SRC}/boost_build/" \
    --prefix="${WAX_BOOST_ROOT}" \
    -j "$(nproc)" \
    -q \
    cxxflags=-fPIC \
    runtime-link=static \
    link=static \
    threading=multi \
    --with-atomic \
    --with-chrono \
    --with-context \
    --with-coroutine \
    --with-date_time \
    --with-filesystem \
    --with-iostreams \
    --with-program_options \
    --with-regex \
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
    no-ssl2 no-ssl3 \
    no-tls1 no-tls1_1 no-tls1_2 no-tls1_3 \
    no-dtls no-dtls1 no-dtls1_2 \
    no-engine \
    no-comp \
    no-cms \
    no-ocsp \
    no-srp \
    no-psk \
    no-gost \
    no-idea no-mdc2 no-rc2 no-rc4 no-rc5 \
    no-camellia no-cast no-chacha no-poly1305 \
    no-des no-bf no-seed no-sm2 no-sm3 no-sm4 \
    no-aria no-siphash no-whirlpool \
    no-ssl-trace \
    no-legacy \
    no-tests \
    no-afalgeng \
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

# Build and install ncurses with static library (needed by readline)
echo "=== Building ncurses ==="
TMP_SRC=/tmp/ncurses_src
mkdir -p "${TMP_SRC}"
cd "${TMP_SRC}"
curl -LO "https://ftp.gnu.org/gnu/ncurses/ncurses-${NCURSES_VERSION}.tar.gz"
tar xzf "ncurses-${NCURSES_VERSION}.tar.gz"
cd "ncurses-${NCURSES_VERSION}"
CFLAGS="-fPIC" CXXFLAGS="-fPIC" ./configure \
    --prefix="${WAX_NCURSES_ROOT}" \
    --without-shared \
    --with-normal \
    --without-debug \
    --enable-widec \
    --with-termlib
make -j "$(nproc)"
make install
rm -rf "${TMP_SRC}"

# Build and install readline with static library
echo "=== Building readline ==="
TMP_SRC=/tmp/readline_src
mkdir -p "${TMP_SRC}"
cd "${TMP_SRC}"
curl -LO "https://ftp.gnu.org/gnu/readline/readline-${READLINE_VERSION}.tar.gz"
tar xzf "readline-${READLINE_VERSION}.tar.gz"
cd "readline-${READLINE_VERSION}"
CFLAGS="-fPIC" LDFLAGS="-L${WAX_NCURSES_ROOT}/lib" CPPFLAGS="-I${WAX_NCURSES_ROOT}/include" ./configure \
    --prefix="${WAX_READLINE_ROOT}" \
    --with-curses \
    --disable-shared \
    --enable-static
make -j "$(nproc)"
make install
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
/opt/python/cp312-cp312/bin/pip install poetry==2.2.0 grpcio-tools mypy-protobuf jinja2
# Also install jinja2 for Python 3.14 (used by hive build helpers)
/opt/python/cp314-cp314/bin/pip install jinja2
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
