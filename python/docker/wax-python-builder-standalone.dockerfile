# Combined standalone Dockerfile for wax Python development
# Combines: common-ci-configuration/Dockerfile.ci-base-image + wax/Dockerfile.ci + wax-python-builder.dockerfile
#
# This Dockerfile is self-contained and does not depend on external hive group images.
# Base image: phusion/baseimage:noble-1.0.1 (Ubuntu 24.04)
#
# Build:
#   docker build -f python/docker/wax-python-builder-standalone.dockerfile \
#       --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g) \
#       -t wax-python-builder:standalone .
#
# Usage:
#   docker run -it -v $(pwd):/home/user/wax wax-python-builder:standalone

# ==============================================================================
# STAGE 1: CI Base Image (from common-ci-configuration/Dockerfile.ci-base-image)
# ==============================================================================
ARG BASE_IMAGE=phusion/baseimage:noble-1.0.1
FROM ${BASE_IMAGE} AS ci-base-image-stage

ARG PYTHON_VERSION=3.14
ARG POETRY_VERSION=2.1.3
ARG DOCKER_CLI_VERSION=28.0.1
ARG BUILDX_VERSION=v0.24.0

ENV LANG=en_US.UTF-8
ENV PATH="/home/hived_admin/.local/bin:$PATH"

SHELL ["/bin/bash", "-c"]

USER root
WORKDIR /usr/local/src

# Install runtime packages
RUN apt-get update && \
    apt-get install -y \
        language-pack-en \
        sudo \
        screen \
        libsnappy1v5 \
        libreadline8 \
        wget \
        curl \
        ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install development packages and Python ${PYTHON_VERSION}
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository -y ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y \
        # Build tools
        git \
        build-essential \
        autoconf \
        automake \
        cmake \
        clang \
        clang-tidy \
        g++ \
        libtool \
        make \
        pkg-config \
        ninja-build \
        doxygen \
        xxd \
        # Libraries
        libboost-all-dev \
        libbz2-dev \
        libpq-dev \
        libsnappy-dev \
        libssl-dev \
        libncurses5-dev \
        libreadline-dev \
        liburing-dev \
        # Python (base packages from system)
        python3 \
        python3-pip \
        python3-venv \
        python3-dev \
        python3-jinja2 \
        python3-dateutil \
        python3-setuptools \
        # Python (specific version from deadsnakes PPA)
        python${PYTHON_VERSION} \
        python${PYTHON_VERSION}-venv \
        python${PYTHON_VERSION}-dev \
        # Misc
        perl \
        p7zip-full \
        tzdata \
        zopfli \
        gir1.2-glib-2.0 \
        libgirepository-1.0-1 \
        libglib2.0-0 \
        libglib2.0-data \
        libxml2 \
        shared-mime-info \
        xdg-user-dirs \
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    && update-alternatives --install /usr/bin/python3 python3 /usr/bin/python${PYTHON_VERSION} 1

# Install sccache for distributed compiler caching
RUN curl -fsSL https://github.com/mozilla/sccache/releases/download/v0.8.1/sccache-v0.8.1-x86_64-unknown-linux-musl.tar.gz \
    | tar xz -C /usr/local/bin --strip-components=1 --wildcards '*/sccache' \
    && chmod +x /usr/local/bin/sccache

# Create hived_admin user with sudo access (for backwards compatibility with hive/hive ci-base-image)
RUN useradd -ms /bin/bash -u 2000 -g users -c "Hived admin account" hived_admin && \
    echo "hived_admin ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Create hived user for running hived daemon (used by hive builds)
RUN useradd -ms /bin/bash -u 2001 -g users -c "Hived daemon account" hived

# Install Docker CLI
RUN curl -fsSLO "https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_CLI_VERSION}.tgz" && \
    tar xzvf "docker-${DOCKER_CLI_VERSION}.tgz" --strip 1 -C /usr/local/bin docker/docker && \
    rm "docker-${DOCKER_CLI_VERSION}.tgz" && \
    mkdir -p /usr/libexec/docker/cli-plugins && \
    curl -fsSL "https://github.com/docker/buildx/releases/download/${BUILDX_VERSION}/buildx-${BUILDX_VERSION}.linux-amd64" \
        -o /usr/libexec/docker/cli-plugins/docker-buildx && \
    chmod +x /usr/libexec/docker/cli-plugins/docker-buildx

# Install websocat
RUN wget -q https://github.com/vi/websocat/releases/download/v1.11.0/websocat.x86_64-unknown-linux-musl \
        -O /usr/local/bin/websocat && \
    chmod +x /usr/local/bin/websocat

# Install faketime (Syncad fork with bw_timer_settime_fix)
RUN git clone --depth 1 --branch bw_timer_settime_fix https://gitlab.syncad.com/bwrona/faketime.git /tmp/faketime && \
    cd /tmp/faketime && \
    CFLAGS="-O2 -DFAKE_STATELESS=1" make && \
    make install && \
    cd / && rm -rf /tmp/faketime

USER hived_admin
WORKDIR /home/hived_admin

# Configure git
RUN git config --global --add safe.directory '*'

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    /home/hived_admin/.local/bin/poetry self update ${POETRY_VERSION} && \
    /home/hived_admin/.local/bin/poetry self add "poetry-dynamic-versioning[plugin]@>=1.0.0,<2.2.0"

# Compile Python bytecode for faster startup
RUN python3 -c "import sysconfig, compileall; compileall.compile_dir(sysconfig.get_path('stdlib'))"

# ==============================================================================
# STAGE 2: Boost source clone (from wax/Dockerfile.ci)
# ==============================================================================
FROM ci-base-image-stage AS boost_lib_source

ARG BOOST_VERSION_TAG=boost-1.83.0
ENV BOOST_VERSION_TAG=${BOOST_VERSION_TAG}

ENV TMP_SRC=/home/hived_admin/tmp_src

RUN <<-EOF
  set -e

  mkdir -vp "${TMP_SRC}"
  cd "${TMP_SRC}"

  git clone --recurse-submodules --shallow-submodules --single-branch --depth=1 --branch ${BOOST_VERSION_TAG} https://github.com/boostorg/boost.git
EOF

# ==============================================================================
# STAGE 3: Boost build (from wax/Dockerfile.ci)
# ==============================================================================
FROM boost_lib_source AS boost_lib_builder

ENV WAX_BOOST_ROOT=/wax_boost_root/

ADD ./python/scripts/prepare_boost.sh /home/hived_admin/prepare_boost.sh

RUN sudo -n mkdir -vp "${WAX_BOOST_ROOT}" && \
    sudo -n chmod -R a+w "${WAX_BOOST_ROOT}" && \
    /home/hived_admin/prepare_boost.sh "${TMP_SRC}" "${WAX_BOOST_ROOT}"

# ==============================================================================
# STAGE 4: WAX CI base image with Boost and Node.js (from wax/Dockerfile.ci)
# ==============================================================================
FROM ci-base-image-stage AS wax-ci-base-image

USER hived_admin
WORKDIR /home/hived_admin
SHELL ["/bin/bash", "-c"]

ENV WAX_BOOST_ROOT=/wax_boost_root/

RUN sudo curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - && \
    sudo apt-get install -y nodejs && \
    sudo npm install -g npm@latest && \
    sudo npm install -g pnpm typescript tsx

COPY --chown=hived_admin --from=boost_lib_builder "${WAX_BOOST_ROOT}" "${WAX_BOOST_ROOT}"

# ==============================================================================
# STAGE 5: Final wax-python-builder (from wax/wax-python-builder.dockerfile)
# ==============================================================================
FROM wax-ci-base-image AS wax-python-builder

# User hosts user ids...
ARG USER_NAME=user
ARG USER_ID=1000
ARG GROUP_ID=1000

USER root

# Create user group and user, add to hived_admin group, install debug tools and NVM
RUN groupadd -g $GROUP_ID usergroup && \
    useradd -m -s /bin/bash -u $USER_ID -g $GROUP_ID ${USER_NAME} && \
    usermod -a -G $(id -g hived_admin) ${USER_NAME} && \
    DEBIAN_FRONTEND=noninteractive apt update && DEBIAN_FRONTEND=noninteractive apt install -y gdb python3.12-dbg && \
    apt update && apt install -y curl && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash && \
    export NVM_DIR="/root/.nvm" && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install --lts && \
    nvm use --lts

# Switch to created user
USER ${USER_NAME}
WORKDIR /home/${USER_NAME}

# Command to run upon container start (optional)
CMD ["/bin/bash"]
