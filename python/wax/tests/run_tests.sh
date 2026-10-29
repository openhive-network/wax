#!/bin/bash
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
TIMEOUT_PROXY_MOCK_SERVER_SECONDS="${TIMEOUT_PROXY_MOCK_SERVER_SECONDS:-180}"
MOCK_SERVER_PORT="${MOCK_SERVER_PORT:-4000}"
MOCK_SERVER_URL="http://localhost:${MOCK_SERVER_PORT}"

WAX_DIR="${SCRIPTPATH}/../../../"
PYPROJECT_DIR="${WAX_DIR}python/wax"

# Configure pnpm to use a project-local store to avoid permission issues
# with the shared /builds/.pnpm-store in CI environments
export PNPM_HOME="${WAX_DIR}/.pnpm-home"

echo -e "${TXT_BLUE}Install proxy-mock-server.ts dependencies...${TXT_CLEAR}"
pnpm -C "${WAX_DIR}/ts" --recursive install --frozen-lockfile
MOCK_SERVER_LOG="${PYPROJECT_DIR}/mock-server.log"

echo -e "${TXT_BLUE}Starting proxy-mock-server.ts ...${TXT_CLEAR}"
# Requests with no mock data are answered from the recorded API responses, see WAX_TEST_API_MODE in ts/wasm/__tests__/assets/api-traffic.ts
"${WAX_DIR}/ts/node_modules/.bin/tsx" "${WAX_DIR}/ts/wasm/__tests__/assets/start-proxy-mock-server.ts" "${MOCK_SERVER_PORT}" > "${MOCK_SERVER_LOG}" 2>&1 &
MOCK_SERVER_PID=$!
trap 'kill "${MOCK_SERVER_PID}" 2>/dev/null || true' EXIT

fail_mock_server_startup() {
  echo -e "${TXT_RED:-\e[1;31m}$1${TXT_CLEAR}"
  echo "Last lines of ${MOCK_SERVER_LOG}:"
  tail -n 50 "${MOCK_SERVER_LOG}"
  exit 1
}

# A request the mock answers itself, so that readiness does not depend on any upstream node
READINESS_REQUEST='{"jsonrpc":"2.0","method":"database_api.get_dynamic_global_properties","params":{},"id":1}'

echo -e "${TXT_BLUE}Waiting for proxy server to be ready...${TXT_CLEAR}"
STARTUP_BEGIN=${SECONDS}
until curl -sf --max-time 5 -H "Content-Type: application/json" -d "${READINESS_REQUEST}" "${MOCK_SERVER_URL}" > /dev/null; do
  if ! kill -0 "${MOCK_SERVER_PID}" 2>/dev/null; then
    wait "${MOCK_SERVER_PID}" && status=0 || status=$?
    fail_mock_server_startup "proxy-mock-server.ts exited with status ${status} before answering on ${MOCK_SERVER_URL}"
  fi
  if (( SECONDS - STARTUP_BEGIN >= TIMEOUT_PROXY_MOCK_SERVER_SECONDS )); then
    fail_mock_server_startup "proxy-mock-server.ts did not answer on ${MOCK_SERVER_URL} within ${TIMEOUT_PROXY_MOCK_SERVER_SECONDS}s (TIMEOUT_PROXY_MOCK_SERVER_SECONDS)"
  fi
  sleep 1
done
echo -e "${TXT_BLUE}Server is up after $(( SECONDS - STARTUP_BEGIN ))s!${TXT_CLEAR}"

# Allow to pass additional parameters to the underlying pytest command, i.e. -vvv ./tests/operation_visitor to run only single group
poetry -C "${PYPROJECT_DIR}" run pytest \
  --proxy-mock-server-endpoint="${MOCK_SERVER_URL}" \
  --junitxml="${SCRIPTPATH}/report.xml" \
  --ignore="${SCRIPTPATH}/simple_flow" \
  --ignore="${SCRIPTPATH}/helpy_test" \
  "${SCRIPTPATH}" "$@"

echo "${TXT_BLUE}Tests done successfully!${TXT_CLEAR}"
