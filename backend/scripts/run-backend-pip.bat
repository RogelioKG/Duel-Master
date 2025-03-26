@echo off

:: venv
call scripts\venv-pip.bat

:: run the app
flask --app src run --debug --port 3000
