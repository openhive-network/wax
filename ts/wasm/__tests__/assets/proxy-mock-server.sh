#!/bin/bash
# Sourced by the Python test runners (python/wax/tests/run_tests.sh, python/test_tools/tests/hived_handle_tests/run_tests.sh).
#
# start_proxy_mock_server <port> <log file>
#   Installs the dependencies of start-proxy-mock-server.ts, starts it in the background (killed when the calling shell exits)
#   and waits until it answers on http://localhost:<port>. On failure prints the tail of <log file> and exits.
#   Requests with no mock data are answered from the recorded API responses, see WAX_TEST_API_MODE in api-traffic.ts.

PROXY_MOCK_SERVER_ASSETS_DIR="$( cd -- "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd -P )"
PROXY_MOCK_SERVER_TS_DIR="${PROXY_MOCK_SERVER_ASSETS_DIR}/../../.."
TIMEOUT_PROXY_MOCK_SERVER_SECONDS="${TIMEOUT_PROXY_MOCK_SERVER_SECONDS:-180}"

start_proxy_mock_server() {
  local port="$1"
  local log="$2"
  local url="http://localhost:${port}"

  # Configure pnpm to use a project-local store to avoid permission issues
  # with the shared /builds/.pnpm-store in CI environments
  export PNPM_HOME="${PROXY_MOCK_SERVER_TS_DIR}/../.pnpm-home"

  echo -e "${TXT_BLUE}Install proxy-mock-server.ts dependencies...${TXT_CLEAR}"
  pnpm -C "${PROXY_MOCK_SERVER_TS_DIR}" --recursive install --frozen-lockfile

  echo -e "${TXT_BLUE}Starting proxy-mock-server.ts ...${TXT_CLEAR}"
  "${PROXY_MOCK_SERVER_TS_DIR}/node_modules/.bin/tsx" "${PROXY_MOCK_SERVER_ASSETS_DIR}/start-proxy-mock-server.ts" "${port}" > "${log}" 2>&1 &
  local pid=$!
  # shellcheck disable=SC2064 # the pid is expanded now, the trap runs when the calling shell exits
  trap "kill ${pid} 2>/dev/null || true" EXIT

  # A request the mock answers itself, so that readiness does not depend on any upstream node
  local readiness_request='{"jsonrpc":"2.0","method":"database_api.get_dynamic_global_properties","params":{},"id":1}'

  echo -e "${TXT_BLUE}Waiting for proxy server to be ready...${TXT_CLEAR}"
  local startup_begin=${SECONDS}
  local status
  until curl -sf --max-time 5 -H "Content-Type: application/json" -d "${readiness_request}" "${url}" > /dev/null; do
    if ! kill -0 "${pid}" 2>/dev/null; then
      wait "${pid}" && status=0 || status=$?
      _fail_proxy_mock_server_startup "${log}" "proxy-mock-server.ts exited with status ${status} before answering on ${url}"
    fi
    if (( SECONDS - startup_begin >= TIMEOUT_PROXY_MOCK_SERVER_SECONDS )); then
      _fail_proxy_mock_server_startup "${log}" "proxy-mock-server.ts did not answer on ${url} within ${TIMEOUT_PROXY_MOCK_SERVER_SECONDS}s (TIMEOUT_PROXY_MOCK_SERVER_SECONDS)"
    fi
    sleep 1
  done
  echo -e "${TXT_BLUE}Server is up after $(( SECONDS - startup_begin ))s!${TXT_CLEAR}"
}

_fail_proxy_mock_server_startup() {
  echo -e "${TXT_RED:-\e[1;31m}$2${TXT_CLEAR}"
  echo "Last lines of $1:"
  tail -n 50 "$1"
  exit 1
}
