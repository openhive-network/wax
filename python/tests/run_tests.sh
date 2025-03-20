#!/bin/bash
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

# Allow to pass additional parameters to the underlying pytest command, i.e. -vvv ./tests/operation_visitor to run only single group

poetry -C "${SCRIPTPATH}/../" run pytest --junitxml="${SCRIPTPATH}/report.xml" --ignore="${SCRIPTPATH}/simple_flow" --ignore="${SCRIPTPATH}/helpy_test" "${SCRIPTPATH}" "$@"
