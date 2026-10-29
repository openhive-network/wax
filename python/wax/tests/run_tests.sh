#!/bin/bash
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
MOCK_SERVER_PORT="${MOCK_SERVER_PORT:-4000}"
MOCK_SERVER_URL="http://localhost:${MOCK_SERVER_PORT}"

WAX_DIR="${SCRIPTPATH}/../../../"
PYPROJECT_DIR="${WAX_DIR}python/wax"

# shellcheck source=../../../ts/wasm/__tests__/assets/proxy-mock-server.sh
source "${WAX_DIR}/ts/wasm/__tests__/assets/proxy-mock-server.sh"
start_proxy_mock_server "${MOCK_SERVER_PORT}" "${PYPROJECT_DIR}/mock-server.log"

# Allow to pass additional parameters to the underlying pytest command, i.e. -vvv ./tests/operation_visitor to run only single group
poetry -C "${PYPROJECT_DIR}" run pytest \
  --proxy-mock-server-endpoint="${MOCK_SERVER_URL}" \
  --junitxml="${SCRIPTPATH}/report.xml" \
  --ignore="${SCRIPTPATH}/simple_flow" \
  --ignore="${SCRIPTPATH}/helpy_test" \
  "${SCRIPTPATH}" "$@"

echo "${TXT_BLUE}Tests done successfully!${TXT_CLEAR}"
