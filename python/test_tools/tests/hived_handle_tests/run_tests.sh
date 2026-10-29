#!/bin/bash
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
MOCK_SERVER_PORT="${MOCK_SERVER_PORT:-4000}"
MOCK_SERVER_URL="http://localhost:${MOCK_SERVER_PORT}/"

REPO_DIR="${SCRIPTPATH}/../../../.."
TEST_TOOLS_DIR="${REPO_DIR}/python/test_tools"

# shellcheck source=../../../../ts/wasm/__tests__/assets/proxy-mock-server.sh
source "${REPO_DIR}/ts/wasm/__tests__/assets/proxy-mock-server.sh"
start_proxy_mock_server "${MOCK_SERVER_PORT}" "${TEST_TOOLS_DIR}/mock-server.log"

# Batch requests have no mock data, so they are answered from the responses recorded from api.hive.blog
# Additional parameters are passed to pytest, i.e. --junitxml=report.xml
python3 -m pytest -n auto --hived-http-endpoint="${MOCK_SERVER_URL}" "${SCRIPTPATH}" "$@"

echo -e "${TXT_BLUE}Tests done successfully!${TXT_CLEAR}"
