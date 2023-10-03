FROM registry.gitlab.syncad.com/hive/hive/ci-base-image:ubuntu22.04-7

# Install protoc poetry plugin
RUN poetry self add poetry-grpc-plugin@0.1.7