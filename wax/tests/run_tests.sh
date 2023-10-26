#!/bin/bash
if [[ -v CI_PROJECT_DIR ]]; then
pytest --junitxml="${CI_PROJECT_DIR}/wax/tests/report.xml" "${CI_PROJECT_DIR}/wax/tests/"
else
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
poetry run pytest ${SCRIPTPATH}
fi