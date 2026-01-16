FROM quay.io/pypa/manylinux_2_28_x86_64:latest

# User hosts user ids...
ARG USER_NAME=user
ARG USER_ID=1000
ARG GROUP_ID=1000

# Python version from manylinux (for example to set Python 3.14 - set PYTHON_VERSION arg to 314)
ARG PYTHON_VERSION=314
ENV PATH="/usr/local/bin:/opt/python/cp${PYTHON_VERSION}-cp${PYTHON_VERSION}/bin:${PATH}"

# Boost version and install location
ARG BOOST_VERSION_TAG=boost-1.83.0
ENV WAX_BOOST_ROOT=/wax_boost_root

# OpenSSL version and install location (static build)
ARG OPENSSL_VERSION=openssl-3.0.16
ENV WAX_OPENSSL_ROOT=/wax_openssl_root

# zlib version and install location (static build)
ARG ZLIB_VERSION=1.3.1
ENV WAX_ZLIB_ROOT=/wax_zlib_root

# bzip2 version and install location (static build)
ARG BZIP2_VERSION=1.0.8
ENV WAX_BZIP2_ROOT=/wax_bzip2_root

# Validate Python version exists
RUN if [ ! -x "/opt/python/cp${PYTHON_VERSION}-cp${PYTHON_VERSION}/bin/python" ]; then \
        echo "ERROR: Python interpreter not found at /opt/python/cp${PYTHON_VERSION}-cp${PYTHON_VERSION}/bin/python"; \
        echo "For example to set Python 3.14 - set PYTHON_VERSION arg to 314"; \
        echo "Available Python versions:"; \
        ls -1 /opt/python/; \
        exit 1; \
    fi

# Build and install Boost (required for wax wheel build)
RUN set -ex && \
    TMP_SRC=/tmp/boost_src && \
    mkdir -p "${TMP_SRC}" && \
    cd "${TMP_SRC}" && \
    git clone --recurse-submodules --shallow-submodules --single-branch --depth=1 --branch ${BOOST_VERSION_TAG} https://github.com/boostorg/boost.git && \
    cd "${TMP_SRC}/boost" && \
    ./bootstrap.sh --without-icu --prefix="${WAX_BOOST_ROOT}" && \
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
        install && \
    rm -rf "${TMP_SRC}"

# Build and install OpenSSL with static libraries (required for wax wheel build)
RUN set -ex && \
    dnf install -y perl-IPC-Cmd perl-Digest-SHA && \
    TMP_SRC=/tmp/openssl_src && \
    mkdir -p "${TMP_SRC}" && \
    cd "${TMP_SRC}" && \
    curl -LO "https://github.com/openssl/openssl/releases/download/${OPENSSL_VERSION}/${OPENSSL_VERSION}.tar.gz" && \
    tar xzf "${OPENSSL_VERSION}.tar.gz" && \
    cd "${OPENSSL_VERSION}" && \
    ./config \
        --prefix="${WAX_OPENSSL_ROOT}" \
        --openssldir="${WAX_OPENSSL_ROOT}" \
        no-shared \
        -fPIC && \
    make -j "$(nproc)" && \
    make install_sw && \
    rm -rf "${TMP_SRC}"

# Build and install zlib with static library (required for wax wheel build)
RUN set -ex && \
    TMP_SRC=/tmp/zlib_src && \
    mkdir -p "${TMP_SRC}" && \
    cd "${TMP_SRC}" && \
    curl -LO "https://zlib.net/zlib-${ZLIB_VERSION}.tar.gz" && \
    tar xzf "zlib-${ZLIB_VERSION}.tar.gz" && \
    cd "zlib-${ZLIB_VERSION}" && \
    CFLAGS="-fPIC" ./configure \
        --prefix="${WAX_ZLIB_ROOT}" \
        --static && \
    make -j "$(nproc)" && \
    make install && \
    rm -rf "${TMP_SRC}"

# Build and install bzip2 with static library (required for wax wheel build)
RUN set -ex && \
    TMP_SRC=/tmp/bzip2_src && \
    mkdir -p "${TMP_SRC}" && \
    cd "${TMP_SRC}" && \
    curl -LO "https://sourceware.org/pub/bzip2/bzip2-${BZIP2_VERSION}.tar.gz" && \
    tar xzf "bzip2-${BZIP2_VERSION}.tar.gz" && \
    cd "bzip2-${BZIP2_VERSION}" && \
    make -j "$(nproc)" CFLAGS="-fPIC -O2" && \
    make install PREFIX="${WAX_BZIP2_ROOT}" && \
    rm -rf "${TMP_SRC}"

USER root
# so that it will be able to mount local directory with valid privilages
RUN groupadd -g $GROUP_ID usergroup && \
    useradd -m -s /bin/bash -u $USER_ID -g $GROUP_ID ${USER_NAME} && \
    # Install build dependencies for wax
    # zlib-devel/bzip2-devel provide shared libs (.so) for fc_shared_boost target
    # Our custom static builds (.a) are used for the main fc target
    # vim-common provides xxd (resource compiler for compression dictionaries)
    dnf install -y \
        gdb \
        ninja-build \
        cmake \
        zlib-devel \
        bzip2-devel \
        ncurses-devel \
        readline-devel \
        vim-common \
        && \
    # Build and install zopfli (not available in AlmaLinux repos)
    TMP_ZOPFLI=/tmp/zopfli_src && \
    mkdir -p "${TMP_ZOPFLI}" && \
    cd "${TMP_ZOPFLI}" && \
    curl -LO "https://github.com/google/zopfli/archive/refs/tags/zopfli-1.0.3.tar.gz" && \
    tar xzf zopfli-1.0.3.tar.gz && \
    cd zopfli-zopfli-1.0.3 && \
    make -j "$(nproc)" zopfli && \
    cp zopfli /usr/local/bin/ && \
    cd / && \
    rm -rf "${TMP_ZOPFLI}" && \
    pip install poetry==2.1.3 && \
    # Install grpcio-tools with Python 3.12 (grpcio-tools doesn't support Python 3.14 yet)
    /opt/python/cp312-cp312/bin/pip install grpcio-tools mypy-protobuf && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash && \
    export NVM_DIR="/root/.nvm" && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install --lts && \
    NODE_DIR=$(find /root/.nvm/versions/node -maxdepth 1 -type d -name "v*" | head -1) && \
    cp -r "$NODE_DIR/bin/"* /usr/local/bin/ && \
    cp -r "$NODE_DIR/lib/"* /usr/local/lib/ && \
    cp -r "$NODE_DIR/include/"* /usr/local/include/ && \
    cp -r "$NODE_DIR/share/"* /usr/local/share/


# Switch to created user
USER ${USER_NAME}
WORKDIR /home/${USER_NAME}

# Command to run upon container start (optional)
CMD ["/bin/bash"]
