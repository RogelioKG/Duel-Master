#!/bin/bash

# create virtual environment
cd backend
python3 -m venv .venv

# activate virtual environment
source .venv/bin/activate

# install dependencies
pip install -r requirements.txt

# run the app
python app.py