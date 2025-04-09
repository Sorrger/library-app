from fastapi import FastAPI
import uvicorn
from routes import books
from database import create_tables 
from database.database import engine, Base
import models

app = FastAPI()
app.include_router(books.router)
# def create_tables():
#     Base.metadata.create_all(bind=engine)
#     print("All tables created successfully!")


if __name__ == "__main__":
    #create_tables()
    uvicorn.run(app, host ="127.0.0.1", port = 8000)
