#!/bin/bash

# venv
uv sync
source .venv/bin/activate

# run the app
flask --app src run --debug --port 3000