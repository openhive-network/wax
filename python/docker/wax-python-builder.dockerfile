ARG BASE_IMAGE=quay.io/pypa/manylinux_2_28:latest
FROM $BASE_IMAGE

# User hosts user ids...
ARG USER_NAME=user
ARG USER_ID=1000
ARG GROUP_ID=1000

# Python version from manylinux (for example to set Python 3.14 - set PYTHON_VERSION arg to 314)
ARG PYTHON_VERSION=314
ENV PATH="/usr/local/bin:/opt/python/cp${PYTHON_VERSION}-cp${PYTHON_VERSION}/bin:${PATH}"

# Boost version and install location
ARG BOOST_VERSION_TAG=boost-1.83.0
ENV BOOST_VERSION_TAG=${BOOST_VERSION_TAG}
ENV WAX_BOOST_ROOT=/wax_boost_root

# OpenSSL version and install location (static build)
ARG OPENSSL_VERSION=openssl-3.0.16
ENV OPENSSL_VERSION=${OPENSSL_VERSION}
ENV WAX_OPENSSL_ROOT=/wax_openssl_root

# zlib version and install location (static build)
ARG ZLIB_VERSION=1.3.1
ENV ZLIB_VERSION=${ZLIB_VERSION}
ENV WAX_ZLIB_ROOT=/wax_zlib_root

# bzip2 version and install location (static build)
ARG BZIP2_VERSION=1.0.8
ENV BZIP2_VERSION=${BZIP2_VERSION}
ENV WAX_BZIP2_ROOT=/wax_bzip2_root

# Validate Python version exists
RUN if [ ! -x "/opt/python/cp${PYTHON_VERSION}-cp${PYTHON_VERSION}/bin/python" ]; then \
        echo "ERROR: Python interpreter not found at /opt/python/cp${PYTHON_VERSION}-cp${PYTHON_VERSION}/bin/python"; \
        echo "For example to set Python 3.14 - set PYTHON_VERSION arg to 314"; \
        echo "Available Python versions:"; \
        ls -1 /opt/python/; \
        exit 1; \
    fi

# Copy and run the dependency installation script
COPY ./python/scripts/install_build_dependencies.sh /tmp/install_build_dependencies.sh
RUN chmod +x /tmp/install_build_dependencies.sh && \
    /tmp/install_build_dependencies.sh && \
    rm /tmp/install_build_dependencies.sh

USER root
# Create user so that it will be able to mount local directory with valid privileges
RUN groupadd -g $GROUP_ID usergroup && \
    useradd -m -s /bin/bash -u $USER_ID -g $GROUP_ID ${USER_NAME}

# Switch to created user
USER ${USER_NAME}
WORKDIR /home/${USER_NAME}

# Command to run upon container start (optional)
CMD ["/bin/bash"]
