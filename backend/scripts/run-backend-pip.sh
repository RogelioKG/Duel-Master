#!/bin/bash

# venv
source ./scripts/venv-pip.sh

# run the app
flask --app src run --debug --port 3000