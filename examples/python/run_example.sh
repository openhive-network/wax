#!/bin/bash
set -e

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

poetry -C "${SCRIPTPATH}/../../python" run python ${SCRIPTPATH}/examples/visitor_example.py
