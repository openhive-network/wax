# Published as registry.gitlab.syncad.com/hive/wax/wax-python-aidev-tests:aidev-<input hash>
# by python/wax/scripts/build_wax_python_aidev_tests_image.sh, which stages the
# build context (the files below, under their repository paths) and passes
# CI_BASE_IMAGE digest-pinned.
#
# The image AIDEV runs .aidev/run-python.sh in, with --network none: the image CI's
# Python jobs use plus everything the wheel build, the Python test jobs and
# pre_commit_checks would otherwise download.
#   /opt/wax-aidev/venv-wax, venv-wax-3.14    Python 3.12 and 3.14 venvs (3.12's keep the
#                                             names they had before 3.14 was added):
#                                             `poetry install --no-root` of
#                                             python/wax/poetry.lock, the [build-system]
#                                             requires, pytest family
#                                             (test_wax_protobuf_python, test_helpy)
#   /opt/wax-aidev/venv-test-tools,           the same for python/test_tools/poetry.lock
#     venv-test-tools-3.14                    without hiveio-wax, as CI's
#                                             .test_tools_test_env does
#   /opt/wax-aidev/venv-pre-commit-3.14       pre_commit_checks' environment: wax's
#                                             dependencies (with the static-analysis
#                                             group: mypy, ruff, pre-commit), test-tools'
#                                             without hiveio-wax, test-tools' build
#                                             requires and the pytest family
#   /opt/wax-aidev/pre-commit-home            PRE_COMMIT_HOME: the hook environments of
#                                             python/.pre-commit-config.yaml
#   /opt/wax-aidev/inputs                     `.aidev/run-python.sh --inputs` of the
#                                             checkout the context came from;
#                                             run-python.sh refuses to run against others
#   /opt/pnpm-store, /opt/corepack            `pnpm fetch` of ts/pnpm-lock.yaml and the
#                                             `packageManager` pnpm, for proxy-mock-server.sh
ARG CI_BASE_IMAGE=registry.gitlab.syncad.com/hive/wax/ci-base-image@sha256:ddbafd331e908c71263e85c20b9882921e3353c6e0fbf765f66c8816678dc0a3
FROM ${CI_BASE_IMAGE}

ARG PYTHON_TEST_TOOLS_IMAGE=registry.gitlab.syncad.com/hive/common-ci-configuration/python-test-tools:develop
ARG PYTHON_VERSIONS="3.12 3.14"

# The suite runs as the caller's uid with HOME pointed elsewhere, so the shared
# state is world-writable and the pnpm the `packageManager` field names (through
# corepack) comes before the base image's global pnpm.
ENV WAX_AIDEV=/opt/wax-aidev \
    COREPACK_HOME=/opt/corepack \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    COREPACK_ENABLE_NETWORK=0 \
    PRE_COMMIT_HOME=/opt/wax-aidev/pre-commit-home \
    npm_config_store_dir=/opt/pnpm-store \
    HUSKY=0 \
    DO_NOT_TRACK=1 \
    PYTHON_KEYRING_BACKEND=keyring.backends.null.Keyring \
    PATH=/opt/corepack/bin:${PATH}

USER root
COPY --chown=hived:users . /opt/wax-aidev/src/
RUN mkdir -p /opt/corepack/bin /opt/pnpm-store && chown -R hived:users /opt/wax-aidev /opt/corepack /opt/pnpm-store
USER hived

RUN cd /opt/wax-aidev/src/ts \
    && COREPACK_ENABLE_NETWORK=1 corepack install -g "$(node -p "require('./package.json').packageManager")" \
    && corepack enable --install-directory /opt/corepack/bin pnpm \
    && test "pnpm@$(pnpm --version)" = "$(node -p "require('./package.json').packageManager.split('+')[0]")" \
    && pnpm fetch

# poetry-dynamic-versioning in Poetry's own environment satisfies
# [tool.poetry.requires-plugins], so poetry does not install it per project.
RUN set -e && cd /opt/wax-aidev/src && \
    plugin=$(python3 -c 'import sys, tomllib; d = tomllib.load(open(sys.argv[1], "rb"))["tool"]["poetry"]["requires-plugins"]["poetry-dynamic-versioning"]; print("poetry-dynamic-versioning[" + ",".join(d["extras"]) + "]==" + d["version"])' python/wax/pyproject.toml) && \
    poetry self add "${plugin}" && \
    python3 ccc/python-test-tools-constraints.py "${PYTHON_TEST_TOOLS_IMAGE}" /opt/wax-aidev/python-test-tools-constraints.txt

# poetry-dynamic-versioning would read git tags, and the context is no repository.
# CI sets PYO3_USE_ABI3_FORWARD_COMPATIBILITY for every job (3.14 installs need it).
RUN set -e && cd /opt/wax-aidev/src && \
    export POETRY_DYNAMIC_VERSIONING_BYPASS=0.0.0 PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 && \
    cp inputs /opt/wax-aidev/inputs && \
    build_requires() { python3 -c 'import sys, tomllib; print("\n".join(tomllib.load(open(sys.argv[1], "rb"))["build-system"]["requires"]))' "$1"; } && \
    poetry -C python/test_tools remove --lock -- hiveio-wax && \
    for version in ${PYTHON_VERSIONS}; do \
        tag="-${version}"; \
        [ "${version}" != 3.12 ] || tag=""; \
        for project in wax test_tools; do \
            venv="/opt/wax-aidev/venv-${project//_/-}${tag}"; \
            "python${version}" -m venv "${venv}"; \
            ( \
                set -e; \
                source "${venv}/bin/activate"; \
                poetry -C "python/${project}" install --no-root; \
                mapfile -t requires < <(build_requires "python/${project}/pyproject.toml"); \
                python3 -m pip install "${requires[@]}"; \
                python3 -m pip install -c /opt/wax-aidev/python-test-tools-constraints.txt pytest pytest-asyncio pytest-xdist; \
            ) || exit 1; \
        done; \
    done

# pre_commit_checks runs on the image's python3 (3.14) in one environment holding both
# projects' dependencies. The hook environments come from GitHub; pre-commit needs a git
# repository to install them in.
RUN set -e && cd /opt/wax-aidev/src && \
    export POETRY_DYNAMIC_VERSIONING_BYPASS=0.0.0 PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 && \
    venv=/opt/wax-aidev/venv-pre-commit-3.14 && \
    python3.14 -m venv "${venv}" && \
    source "${venv}/bin/activate" && \
    poetry -C python/wax install --no-root && \
    poetry -C python/test_tools install --no-root && \
    mapfile -t requires < <(python3 -c 'import sys, tomllib; print("\n".join(tomllib.load(open(sys.argv[1], "rb"))["build-system"]["requires"]))' python/test_tools/pyproject.toml) && \
    python3 -m pip install "${requires[@]}" && \
    python3 -m pip install -c /opt/wax-aidev/python-test-tools-constraints.txt pytest pytest-asyncio pytest-xdist && \
    mkdir /tmp/hooks && cp python/.pre-commit-config.yaml /tmp/hooks/ && cd /tmp/hooks && git init -q && \
    pre-commit install-hooks --config .pre-commit-config.yaml && \
    rm -rf /tmp/hooks

USER root
RUN rm -rf /opt/wax-aidev/src /home/hived/.cache \
    && chmod -R a+rwX /opt/wax-aidev /opt/pnpm-store /opt/corepack \
    && chmod a+x /home/hived
USER hived
WORKDIR /
