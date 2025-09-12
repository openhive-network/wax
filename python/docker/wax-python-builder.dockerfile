FROM registry.gitlab.syncad.com/hive/wax/ci-base-image:ubuntu24.04-3

# User hosts user ids...
ARG USER_NAME=user
ARG USER_ID=1000
ARG GROUP_ID=1000

USER root
# so that it will be able to mount local directory with valid privilages
RUN groupadd -g $GROUP_ID usergroup && \
    useradd -m -s /bin/bash -u $USER_ID -g $GROUP_ID ${USER_NAME} && \
    usermod -a -G $(id -g hived_admin) ${USER_NAME} && \
    DEBIAN_FRONTEND=noninteractive apt update && DEBIAN_FRONTEND=noninteractive apt install -y gdb python3.12-dbg && \
    apt update && apt install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt install -y nodejs


# Switch to created user
USER ${USER_NAME}
WORKDIR /home/${USER_NAME}

# Command to run upon container start (optional)
CMD ["/bin/bash"]
