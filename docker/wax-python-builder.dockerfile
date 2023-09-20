FROM registry.gitlab.syncad.com/hive/hive/ci-base-image:ubuntu22.04-3

# User hosts user ids...
ARG USER_NAME=user
ARG USER_ID=1000
ARG GROUP_ID=1000

# so that it will be able to mount local directory with valid privilages
RUN sudo groupadd -g $GROUP_ID usergroup && \
    sudo useradd -m -s /bin/bash -u $USER_ID -g $GROUP_ID ${USER_NAME} && \
    sudo usermod -a -G $(id -g hived_admin) ${USER_NAME}

# Install protoc poetry plugin
RUN poetry self add poetry-grpc-plugin@0.1.7

# Switch to created user
USER ${USER_NAME}
WORKDIR /home/${USER_NAME}

# Command to run upon container start (optional)
CMD ["/bin/bash"]