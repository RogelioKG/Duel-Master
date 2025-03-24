#!/bin/bash

# venv
source ./scripts/venv-pip.sh

# run the test
pytest --cov=src --cov-report=html:tests/report --cov-branch