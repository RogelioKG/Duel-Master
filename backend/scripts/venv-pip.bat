@echo off

:: create virtual environment
if not exist .venv (
  python -m venv .venv
)

:: activate virtual environment
call .venv\Scripts\activate

:: install dependencies
pip install -r requirements.txt