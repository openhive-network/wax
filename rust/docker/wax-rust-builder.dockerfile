FROM registry.gitlab.syncad.com/hive/wax/ci-base-image:pypa_2_28-13

ARG USER_NAME=user
ARG USER_ID=1000
ARG GROUP_ID=1000
ARG RUST_TOOLCHAIN=stable

USER root

RUN groupadd -g $GROUP_ID usergroup && \
    useradd -m -s /bin/bash -u $USER_ID -g $GROUP_ID ${USER_NAME} && \
    usermod -a -G $(id -g hived_admin) ${USER_NAME} && \
    dnf install -y gdb curl protobuf-compiler && \
    dnf clean all

USER ${USER_NAME}
WORKDIR /home/${USER_NAME}

ENV CARGO_HOME=/home/${USER_NAME}/.cargo \
    RUSTUP_HOME=/home/${USER_NAME}/.rustup \
    PATH=/home/${USER_NAME}/.cargo/bin:$PATH \
    BOOST_ROOT=${WAX_BOOST_ROOT}

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | \
        sh -s -- -y --profile minimal --default-toolchain ${RUST_TOOLCHAIN}

CMD ["/bin/bash"]
