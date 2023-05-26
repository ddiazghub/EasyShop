from dotenv import dotenv_values
import logging
import logging.config

logging.config.fileConfig('logging.conf', disable_existing_loggers=False)

# Loads environment variables defined in .env file.
_env = dotenv_values(".env")
USERNAME = _env["DB_USERNAME"]
PASSWORD = _env["DB_PASSWORD"]
HOSTNAME = _env["DB_HOSTNAME"]
DATABASE = _env["DB_NAME"]
DB_PORT = _env["DB_PORT"]
SECRET_KEY = _env["SECRET_KEY"]
JWT_ALGORITHM = "HS256"