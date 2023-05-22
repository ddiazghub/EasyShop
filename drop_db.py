from config import DATABASE
import db.database as database

def drop_database():
    """Drops the database so an updated version can be used instead."""
    database.transaction(lambda cursor: cursor.execute(f"DROP DATABASE \"{DATABASE}\""), "postgres", autocommit=True)

if __name__ == "__main__":
    print("Dropping database...")
    drop_database()
    print(f"Database \"{DATABASE}\" has been dropped.")