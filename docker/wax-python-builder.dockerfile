# Use the Ubuntu 22.04 base image
FROM ubuntu:22.04

# Set environment variables to avoid interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install required packages, including sudo
RUN apt-get update && apt-get install -y \
    sudo python3 python3-pip python3-venv curl cmake libboost-all-dev libssl-dev libbz2-dev libreadline-dev ninja-build git\
    && rm -rf /var/lib/apt/lists/*

# Define build arguments for the user and group IDs
ARG USER_NAME=user
ARG USER_ID=1000
ARG GROUP_ID=1000

# Create a group with the specified GID
RUN groupadd -g $GROUP_ID usergroup

# Create a user with the same name as the host user, using the provided UID and GID
RUN useradd -m -s /bin/bash -u $USER_ID -g $GROUP_ID ${USER_NAME} && \
    echo "${USER_NAME} ALL=(ALL:ALL) NOPASSWD:ALL" > /etc/sudoers.d/${USER_NAME}

# Set the user's home directory
ENV HOME /home/${USER_NAME}
ENV PATH="/home/${USER_NAME}/.local/bin:$PATH"

# Switch to the newly created user
USER ${USER_NAME}

# Set the working directory to the user's home directory
WORKDIR /home/${USER_NAME}

RUN python3 -m pip install --user --upgrade pip && \
    curl -sSL https://install.python-poetry.org | python3 -  --version 1.5.0 && \
    poetry self add poetry-grpc-plugin@0.1.7

# Command to run upon container start (optional)
CMD ["/bin/bash"]
