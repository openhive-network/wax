# The image AIDEV runs this project's suites in (`environment.image` in
# .aidev/project.yaml). It is the emsdk image CI builds the TypeScript package
# with (EMSCRIPTEN_IMAGE in hive/common-ci-configuration's npm_projects template,
# at the ref .gitlab-ci.yml includes): emscripten, cmake, ninja, protoc, Boost
# for wasm, Node 24.21.0, pnpm 10.0.0 and Playwright's chromium. Suites run with
# `--network none`, so this adds a pnpm store filled from ts/pnpm-lock.yaml.
# Build and pin it with .aidev/runtime/build.sh; see .aidev/README.md.
FROM registry.gitlab.syncad.com/hive/common-ci-configuration/emsdk:5.0.2-4@sha256:966dd9e9da494d184fcc7f622bb24d93c41b8d58c814156aa79cd1d70f31d9ab

# CI runs `nvm use $NODEJS_VERSION` first, which puts nvm's Node 24.21.0 bin dir
# (and its pnpm) in front of emsdk's own Node 22.16; do the same without nvm.
# That pnpm is a corepack shim: pnpm from package.json `packageManager` is installed
# into COREPACK_HOME at build time, so it resolves offline. Suites run as the
# caller's uid, so HOME is /tmp, and the store and corepack home are world-writable.
ENV PATH=/home/emscripten/.nvm/versions/node/v24.21.0/bin:/home/emscripten/.local/share/pnpm:/emsdk:/emsdk/upstream/emscripten:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    HOME=/tmp \
    COREPACK_HOME=/opt/corepack \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    COREPACK_ENABLE_NETWORK=0 \
    npm_config_store_dir=/opt/pnpm-store \
    HUSKY=0 \
    DO_NOT_TRACK=1

USER root
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc /tmp/pnpm-fetch/
RUN cd /tmp/pnpm-fetch \
    && COREPACK_ENABLE_NETWORK=1 corepack install -g "$(node -p "require('./package.json').packageManager")" \
    && test "pnpm@$(pnpm --version)" = "$(node -p "require('./package.json').packageManager.split('+')[0]")" \
    && pnpm fetch \
    && cd / && rm -rf /tmp/pnpm-fetch /tmp/.cache /tmp/.local \
    && chmod -R a+rwX /opt/pnpm-store /opt/corepack
USER emscripten
