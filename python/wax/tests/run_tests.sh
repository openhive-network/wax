#!/bin/bash
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

poetry -C "${SCRIPTPATH}/../../" run pytest --junitxml="${SCRIPTPATH}/report.xml" "${SCRIPTPATH}"
