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

engine = create_engine(DataBaseUrl, echo=True)
session_local =sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base = declarative_base() 

def get_db():
    try: 
        db = session_local()
        yield db
    except Exception as e:
        print(f"Problem with database {e}")
    finally:
        db.close()

