#!/bin/bash

# create virtual environment
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

# activate virtual environment
source .venv/bin/activate

# install dependencies
pip install -r requirements.txt