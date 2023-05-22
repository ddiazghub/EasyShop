import psycopg
from psycopg.connection import Connection
from psycopg.rows import Row, RowFactory
from psycopg import Cursor
from config import DB_PORT, USERNAME, HOSTNAME, PASSWORD, DATABASE
from typing import Callable, TypeVar

def connect(database: str = DATABASE, row_factory: RowFactory[Row] | None = None, autocommit: bool = False) -> Connection:
    """
    Establishes a connection to the database, using the environment configuration.

    :param database: Database name.
    :param row_factory: dunno
    :param autocommit: nope
    """
    return psycopg.connect(f"host={HOSTNAME} user={USERNAME} port={DB_PORT} password={PASSWORD} dbname={database} connect_timeout=10", row_factory=row_factory, autocommit=autocommit)

T = TypeVar("T")
def transaction(action: Callable[[Cursor], T], database: str = DATABASE, row_factory: RowFactory[Row] | None = None, autocommit: bool = False) -> T:
    """
    Establishes a connection to the database and executes the given function as a transaction.

    :param database: Database name.
    :param action: Function to execute for the transaction.    
    :param row_factory: dunno
    :param autocommit: nope
    """
    with connect(database, row_factory=row_factory, autocommit=autocommit) as connection, connection.cursor() as cursor:
        result = action(cursor)
        
        if not autocommit:
            connection.commit()

        return result
