@echo off

:: venv
uv sync
call .venv\Scripts\activate.bat

:: run the app
flask --app src run --debug --port 3000