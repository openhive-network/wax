# syntax=registry.gitlab.syncad.com/hive/common-ci-configuration/dockerfile:1.5
FROM ubuntu:24.04 AS runtime_base

# User hosts user ids...
ARG USER_NAME=user
ARG USER_ID=1000
ARG GROUP_ID=1000

SHELL ["/bin/bash", "-c"]

ENV APT_CACHE_DIR=/var/cache/buildkit/apt

RUN --mount=type=cache,mode=0777,sharing=locked,target=${APT_CACHE_DIR} \
    apt-get update && \
    apt-get install -y wget git bash sudo && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    \
    groupadd -o -g $GROUP_ID usergroup && \
    useradd -o -m -s /bin/bash -u $USER_ID -g $GROUP_ID ${USER_NAME}

FROM runtime_base AS python_dev

# renovate: datasource=pypi depName=poetry versioning=semver
ARG POETRY_VERSION=2.1.3
ENV POETRY_VERSION=${POETRY_VERSION}
ENV APT_CACHE_DIR=/var/cache/buildkit/apt

RUN --mount=type=cache,mode=0777,sharing=locked,target=${APT_CACHE_DIR} \
    apt-get update && \
    apt-get install -y python3.12 python3.12-venv python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


RUN set -ex; python3 -m venv --system-site-packages /poetry_venv && \
    source /poetry_venv/bin/activate && \
    pip install --no-cache-dir poetry==$POETRY_VERSION && \
    chown -R ${USER_NAME} /poetry_venv

FROM runtime_base AS devcontainer

COPY --from=python_dev /poetry_venv /poetry_venv 

COPY --from=python_dev /usr/bin/python3 /usr/bin/
COPY --from=python_dev /lib/x86_64-linux-gnu/libexpat.so* /lib/x86_64-linux-gnu/
COPY --from=python_dev /usr/lib/python3.12/ /usr/lib/python3.12/

# Switch to created user
USER ${USER_NAME}
WORKDIR /home/${USER_NAME}

SHELL ["/bin/bash", "-c"]

ENV PIP_EXTRA_INDEX_URL="https://gitlab.syncad.com/api/v4/projects/362/packages/pypi/simple \
                         https://gitlab.syncad.com/api/v4/projects/198/packages/pypi/simple \
                         https://gitlab.syncad.com/api/v4/projects/419/packages/pypi/simple \
                         https://gitlab.syncad.com/api/v4/projects/434/packages/pypi/simple"

# Command to run upon container start (optional)

ENTRYPOINT ["/bin/bash"]
