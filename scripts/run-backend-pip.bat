pushd backend

:: create virtual environment
if not exist .venv (
  python -m venv .venv
)

:: activate virtual environment
call .venv\Scripts\activate

:: install dependencies
pip install -r requirements.txt

:: run the app | deactivate virtual environment
python app.py & call .venv\Scripts\deactivate & popd
