@echo off

:: venv
uv sync
call .venv\Scripts\activate.bat

:: run the test
pytest --cov=src --cov-report=html:tests/report --cov-branch