import os

from dotenv import load_dotenv

load_dotenv(verbose=True)

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path)

USER_NAME = os.environ.get("USER_NAME")
PASSWORD = os.environ.get("PASSWORD")
GOOGLE_SPREADSHEET_POST_URL = os.environ.get("GOOGLE_SPREADSHEET_POST_URL")


NOW_SEMESTER = "2022後期"
