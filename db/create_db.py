from config import DATABASE
from psycopg import Cursor
import db.database as database
import logging

log = logging.getLogger(__name__)

def create_database() -> None:
    """Automatically creates the database if it doesn't exist."""
    #Creates database.
    def create_db(cursor: Cursor) -> None:
        if cursor.execute(f"SELECT datname FROM pg_catalog.pg_database WHERE datname = '{DATABASE}'").fetchone():
            log.info("The database already exists. Skipping creation.")
        else:
            log.info("Creating database.")
            cursor.execute(f"CREATE DATABASE \"{DATABASE}\"") 

    database.transaction(create_db, "postgres", autocommit=True)

    # Creates schema and loads initial data
    def create_schema(cursor: Cursor) -> None:
        if not cursor.execute("SELECT * FROM pg_tables WHERE schemaname = 'public' AND tablename = 'User'").fetchone():
            log.info("Creating table schema.")

            with open("schema.sql") as schema:
                cursor.execute(schema.read())
    
    database.transaction(create_schema)

if __name__ == "__main__":
    create_database()