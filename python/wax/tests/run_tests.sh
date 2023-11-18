#!/bin/bash
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
poetry run pytest --junitxml="${SCRIPTPATH}/report.xml" "${SCRIPTPATH}"