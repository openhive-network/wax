# Node comes from the wax ci-base-image (python/wax/docker/Dockerfile.ci)
FROM registry.gitlab.syncad.com/hive/wax/ci-base-image:pypa_2_28-18

# User hosts user ids...
ARG USER_NAME=user
ARG USER_ID=1000
ARG GROUP_ID=1000

USER root
# so that it will be able to mount local directory with valid privilages
RUN groupadd -g $GROUP_ID usergroup && \
    useradd -m -s /bin/bash -u $USER_ID -g $GROUP_ID ${USER_NAME} && \
    usermod -a -G $(id -g hived_admin) ${USER_NAME} && \
    dnf install -y gdb python3-debug curl && \
    dnf clean all


# Switch to created user
USER ${USER_NAME}
WORKDIR /home/${USER_NAME}

# Command to run upon container start (optional)
CMD ["/bin/bash"]
