@echo off

:: venv
call srcipts\venv-pip.bat

:: run the test
pytest --cov=src --cov-report=html:tests/report --cov-branch