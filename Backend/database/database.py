from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DataBaseUrl = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DataBaseUrl, echo=True, isolation_level="REPEATABLE READ")
session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():

        db = session_local()
        try:
            yield db
        finally:
            db.close()

