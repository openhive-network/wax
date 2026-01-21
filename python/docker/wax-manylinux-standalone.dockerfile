# Combined standalone Dockerfile for wax Python wheel building on manylinux_2_28
#
# This combines the logic from:
# - common-ci-configuration/Dockerfile.ci-base-image (adapted for AlmaLinux 8)
# - wax/Dockerfile.ci (Boost building)
# - wax/Dockerfile.manylinux (static libraries)
#
# Provides glibc 2.28 compatibility (Ubuntu 20.04+, Debian 10+, RHEL 8+)
#
# Build with different Python versions:
#   docker build --build-arg PYTHON_VERSION=3.12 -t wax-manylinux:py3.12 -f python/docker/wax-manylinux-standalone.dockerfile .
#   docker build --build-arg PYTHON_VERSION=3.14 -t wax-manylinux:py3.14 -f python/docker/wax-manylinux-standalone.dockerfile .
#
# Build wheel:
#   docker run --rm -v $(pwd):/home/hived_admin/wax wax-manylinux:py3.12 \
#       bash -c "cd wax && ./python/scripts/build_wax.sh"

ARG BASE_IMAGE=quay.io/pypa/manylinux_2_28_x86_64

# ==============================================================================
# STAGE 1: System dependencies (no Python version dependency)
# ==============================================================================
FROM ${BASE_IMAGE} AS system_deps

ENV WAX_BOOST_ROOT=/wax_boost_root/
ENV BOOST_ROOT=/wax_boost_root/
ENV OPENSSL_ROOT_DIR=/usr/local
ENV LANG=en_US.UTF-8

SHELL ["/bin/bash", "-c"]

# Install build dependencies from system (AlmaLinux 8 / dnf)
# Note: We build static OpenSSL/bzip2 from source - do NOT install openssl-devel
# as it conflicts with our custom build via pkg-config
RUN dnf install -y \
        bzip2-devel \
        libffi-devel \
        xz-devel \
        unzip \
        zlib-static \
        vim-common \
        readline-devel \
        # Additional packages needed for hive/wax build
        snappy-devel \
        libpq-devel \
        ncurses-devel \
        autoconf \
        automake \
        libtool \
        # For faketime
        gcc \
        make \
    && dnf clean all

# Install CMake 3.28 from Kitware (manylinux_2_28 has cmake 4.x which breaks hive/fc)
ARG CMAKE_VERSION=3.28.4
RUN curl -fsSL "https://github.com/Kitware/CMake/releases/download/v${CMAKE_VERSION}/cmake-${CMAKE_VERSION}-linux-x86_64.tar.gz" \
    | tar xz -C /usr/local --strip-components=1

# Install ninja via pip (available for all Python versions via /opt/python)
RUN /opt/python/cp312-cp312/bin/pip install ninja && \
    ln -sf /opt/python/cp312-cp312/lib/python3.12/site-packages/ninja/data/bin/ninja /usr/local/bin/ninja

RUN mkdir -vp "${WAX_BOOST_ROOT}"

# Configure git safe directory
RUN git config --global --add safe.directory '*'

# ==============================================================================
# STAGE 2: Build static libraries (OpenSSL, bzip2, zopfli)
# ==============================================================================
FROM system_deps AS static_libs_builder

# Build static OpenSSL 1.1.1k (fc library requires static linking)
# Install to /usr/local so cmake FindOpenSSL.cmake finds it automatically
ARG OPENSSL_VERSION=1.1.1k
RUN set -e && \
    cd /tmp && \
    curl -fsSL "https://www.openssl.org/source/openssl-${OPENSSL_VERSION}.tar.gz" | tar xz && \
    cd openssl-${OPENSSL_VERSION} && \
    ./config --prefix=/usr/local --openssldir=/usr/local/ssl \
        no-shared -fPIC && \
    make -j$(nproc) && \
    make install_sw && \
    rm -rf /tmp/openssl-${OPENSSL_VERSION}

# Build static bzip2 (fc library requires static linking)
# Install to /usr/local so cmake finds it automatically
ARG BZIP2_VERSION=1.0.8
RUN set -e && \
    cd /tmp && \
    curl -fsSL "https://sourceware.org/pub/bzip2/bzip2-${BZIP2_VERSION}.tar.gz" | tar xz && \
    cd bzip2-${BZIP2_VERSION} && \
    make CFLAGS="-fPIC -O2" -j$(nproc) && \
    cp libbz2.a /usr/local/lib/ && \
    cp bzlib.h /usr/local/include/ && \
    rm -rf /tmp/bzip2-${BZIP2_VERSION}

# Build zopfli (required for words.deflate generation in protocol library)
RUN set -e && \
    cd /tmp && \
    git clone --depth=1 https://github.com/google/zopfli.git && \
    cd zopfli && \
    make && \
    cp zopfli /usr/local/bin/ && \
    chmod +x /usr/local/bin/zopfli && \
    rm -rf /tmp/zopfli

# Install sccache for distributed compiler caching
RUN curl -fsSL https://github.com/mozilla/sccache/releases/download/v0.8.1/sccache-v0.8.1-x86_64-unknown-linux-musl.tar.gz \
    | tar xz -C /usr/local/bin --strip-components=1 --wildcards '*/sccache' \
    && chmod +x /usr/local/bin/sccache

# Install websocat
RUN curl -fsSL https://github.com/vi/websocat/releases/download/v1.11.0/websocat.x86_64-unknown-linux-musl \
        -o /usr/local/bin/websocat && \
    chmod +x /usr/local/bin/websocat

# Note: faketime is skipped - it's from private repo and only needed for testing, not wheel building

# ==============================================================================
# STAGE 3: Build Boost with -fPIC (shared between all Python versions)
# ==============================================================================
FROM static_libs_builder AS boost_builder

ARG BOOST_VERSION_TAG=boost-1.83.0

ENV TMP_SRC=/tmp/boost_src

ADD ./python/scripts/prepare_boost.sh /tmp/prepare_boost.sh

# Clone and build Boost in one step
RUN set -e && \
    mkdir -vp "${TMP_SRC}" && \
    cd "${TMP_SRC}" && \
    git clone --recurse-submodules --shallow-submodules --single-branch --depth=1 \
        --branch ${BOOST_VERSION_TAG} https://github.com/boostorg/boost.git && \
    /tmp/prepare_boost.sh "${TMP_SRC}" "${WAX_BOOST_ROOT}" && \
    rm -rf "${TMP_SRC}"

# ==============================================================================
# STAGE 4: Final image with Python version specific configuration
# ==============================================================================
FROM static_libs_builder AS wax-manylinux

ARG PYTHON_VERSION=3.14
ARG POETRY_VERSION=2.1.3

ENV PYTHON_VERSION=${PYTHON_VERSION}
ENV WAX_BOOST_ROOT=/wax_boost_root/
ENV BOOST_ROOT=/wax_boost_root/
ENV OPENSSL_ROOT_DIR=/usr/local

# Install Node.js LTS (manylinux_2_28 supports modern Node.js)
RUN curl -fsSL https://rpm.nodesource.com/setup_20.x | bash - && \
    dnf install -y nodejs && \
    dnf clean all && \
    npm install -g npm@latest && \
    npm install -g pnpm typescript tsx

# Set up Python path based on version argument
# Also create symlinks for include directories so cmake FindPythonLibs can find them
RUN PYTHON_TAG="cp${PYTHON_VERSION//./}" && \
    PYTHON_PATH="/opt/python/${PYTHON_TAG}-${PYTHON_TAG}" && \
    echo "export PATH=\"${PYTHON_PATH}/bin:\${PATH}\"" >> /etc/profile.d/python.sh && \
    ln -sf "${PYTHON_PATH}/bin/python" /usr/local/bin/python3 && \
    ln -sf "${PYTHON_PATH}/bin/pip" /usr/local/bin/pip3 && \
    ln -sf "${PYTHON_PATH}/include/python${PYTHON_VERSION}" /usr/local/include/python${PYTHON_VERSION} && \
    ln -sf "${PYTHON_PATH}/include/python${PYTHON_VERSION}" /usr/include/python${PYTHON_VERSION}

# Install setuptools (provides distutils, removed in Python 3.12+) and Cython
RUN PYTHON_TAG="cp${PYTHON_VERSION//./}" && \
    /opt/python/${PYTHON_TAG}-${PYTHON_TAG}/bin/pip install setuptools cython

# Create hived_admin user with sudo-like access (for backwards compatibility)
# Note: manylinux doesn't have sudo by default, we use 'users' group
RUN useradd -ms /bin/bash -u 2000 -g users -c "Hived admin account" hived_admin && \
    chown -R hived_admin:users "${WAX_BOOST_ROOT}"

# Create hived user for running hived daemon (used by hive builds)
RUN useradd -ms /bin/bash -u 2001 -g users -c "Hived daemon account" hived

# Copy pre-built Boost libraries (from shared cache)
COPY --from=boost_builder "${WAX_BOOST_ROOT}" "${WAX_BOOST_ROOT}"
RUN chown -R hived_admin:users "${WAX_BOOST_ROOT}"

USER hived_admin
WORKDIR /home/hived_admin

# Source the profile to get correct Python in PATH
ENV BASH_ENV=/etc/profile.d/python.sh
ENV PATH="/home/hived_admin/.local/bin:${PATH}"

# Configure git for hived_admin user
RUN git config --global --add safe.directory '*'

# Install Poetry for the target Python version
RUN source /etc/profile.d/python.sh && \
    curl -sSL https://install.python-poetry.org | python3 - && \
    /home/hived_admin/.local/bin/poetry self update ${POETRY_VERSION} && \
    /home/hived_admin/.local/bin/poetry self add "poetry-dynamic-versioning[plugin]@>=1.0.0,<2.2.0"

# Make poetry available system-wide (for any user)
USER root
RUN ln -sf /home/hived_admin/.local/bin/poetry /usr/local/bin/poetry && \
    chmod 755 /home/hived_admin

# Create cmake wrapper that adds manylinux-specific arguments for configure step
# This is needed because build.py only passes BOOST_ROOT but cmake needs more hints
# to find OpenSSL, Boost includes, and Python on manylinux
RUN mv /usr/local/bin/cmake /usr/local/bin/cmake.real && \
    cat > /usr/local/bin/cmake << 'EOFSCRIPT'
#!/bin/bash
# Wrapper for cmake that adds manylinux-specific arguments ONLY for configure step
EXTRA_ARGS=""

# Only add extra args if this is a configure call (has -S flag)
if [[ "$*" == *"-S"* ]]; then
    # Add OpenSSL include dir if not already present
    if [[ "$*" != *"-DOPENSSL_INCLUDE_DIR"* ]]; then
        EXTRA_ARGS="$EXTRA_ARGS -DOPENSSL_INCLUDE_DIR=/usr/local/include"
    fi

    # Add Boost include dir if not already present
    if [[ "$*" != *"-DBoost_INCLUDE_DIR"* ]]; then
        EXTRA_ARGS="$EXTRA_ARGS -DBoost_INCLUDE_DIR=/wax_boost_root/include"
    fi

    # Add Python include dir if not already present
    if [[ "$*" != *"-DPYTHON_INCLUDE_DIR"* ]]; then
        PYTHON_VERSION=${PYTHON_VERSION:-3.12}
        PYTHON_INCLUDE=$(find /opt/_internal -name "python${PYTHON_VERSION}" -type d 2>/dev/null | grep include | head -1)
        if [[ -n "$PYTHON_INCLUDE" ]]; then
            EXTRA_ARGS="$EXTRA_ARGS -DPYTHON_INCLUDE_DIR=$PYTHON_INCLUDE"
        fi
    fi
fi

exec /usr/local/bin/cmake.real "$@" $EXTRA_ARGS
EOFSCRIPT
RUN chmod +x /usr/local/bin/cmake

# Final switch to hived_admin
USER hived_admin
WORKDIR /home/hived_admin

CMD ["/bin/bash"]
