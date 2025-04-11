#!/bin/bash
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
TIMEOUT_PROXY_MOCK_SERVER_SECONDS="${TIMEOUT_PROXY_MOCK_SERVER_SECONDS:-30}"
MOCK_SERVER_PORT="${MOCK_SERVER_PORT:-4000}"
MOCK_SERVER_URL="http://localhost:${MOCK_SERVER_PORT}"

echo -e "${TXT_BLUE}Install proxy-mock-server.ts dependencies...${TXT_CLEAR}"
pnpm -C "$CI_PROJECT_DIR/ts" --recursive install --frozen-lockfile
echo -e "${TXT_BLUE}Starting proxy-mock-server.ts ...${TXT_CLEAR}"
npx tsx "${CI_PROJECT_DIR}/ts/wasm/__tests__/assets/start-proxy-mock-server.ts" "${MOCK_SERVER_PORT}" 2>&1 > "${PYPROJECT_DIR}/mock-server.log" &
echo "${TXT_BLUE}Waiting for proxy server to be ready...${TXT_CLEAR}"
timeout "$TIMEOUT_PROXY_MOCK_SERVER_SECONDS" bash -c "until curl -s $MOCK_SERVER_URL > /dev/null; do sleep 1; done"
echo "${TXT_BLUE}Server is up!${TXT_CLEAR}"

# Allow to pass additional parameters to the underlying pytest command, i.e. -vvv ./tests/operation_visitor to run only single group
poetry -C "${SCRIPTPATH}/../" run pytest \
  --proxy-mock-server-endpoint="${MOCK_SERVER_URL}" \
  --junitxml="${SCRIPTPATH}/report.xml" \
  --ignore="${SCRIPTPATH}/simple_flow" \
  --ignore="${SCRIPTPATH}/helpy_test" \
  "${SCRIPTPATH}" "$@"

echo "${TXT_BLUE}Tests done successfully!${TXT_CLEAR}"
