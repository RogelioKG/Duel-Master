#!/bin/bash

# venv
uv sync
source .venv/bin/activate

# run the test
pytest --cov=src --cov-report=html:tests/report --cov-branch