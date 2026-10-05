# Published as registry.gitlab.syncad.com/hive/wax/wax-rust-builder:${WAX_RUST_BUILDER_IMAGE_TAG}.
# When editing this file, bump the -rustN suffix of WAX_RUST_BUILDER_IMAGE_TAG in .gitlab-ci.yml:
# CI runners pull with policy if-not-present, so a rebuild pushed under the same tag is ignored.
FROM registry.gitlab.syncad.com/hive/wax/ci-base-image:pypa_2_28-17

ARG USER_NAME=user
ARG USER_ID=1000
ARG GROUP_ID=1000
ARG RUST_TOOLCHAIN=stable

USER root

# The base image may already own USER_ID/GROUP_ID (ci-base-image ships hived as UID 1000).
# Such a user is renamed to USER_NAME; its old home stays reachable through a symlink
# because the base image's PATH points into it.
RUN set -e && \
    if ! getent group "${GROUP_ID}" >/dev/null; then groupadd -g "${GROUP_ID}" usergroup; fi && \
    existing_user=$(getent passwd "${USER_ID}" | cut -d: -f1) && \
    if [ -z "${existing_user}" ]; then \
      useradd -m -s /bin/bash -u "${USER_ID}" -g "${GROUP_ID}" "${USER_NAME}"; \
    elif [ "${existing_user}" != "${USER_NAME}" ]; then \
      old_home=$(getent passwd "${existing_user}" | cut -d: -f6) && \
      old_group=$(id -gn "${existing_user}") && \
      usermod -l "${USER_NAME}" -d "/home/${USER_NAME}" -m -s /bin/bash \
        -g "${GROUP_ID}" -a -G "${old_group}" "${existing_user}" && \
      ln -s "/home/${USER_NAME}" "${old_home}"; \
    fi && \
    if id hived_admin >/dev/null 2>&1; then usermod -a -G "$(id -g hived_admin)" "${USER_NAME}"; fi && \
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

RUN cargo install cargo-edit --locked -f \
        --no-default-features --features "set-version"

CMD ["/bin/bash"]
