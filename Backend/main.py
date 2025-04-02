from fastapi import FastAPI
import uvicorn
from routes import books
from database import create_tables
app = FastAPI()
#app.include_router(books)


if __name__ == "__main__":
    create_tables()
    uvicorn.run(app, host ="0.0.0.0", port = 8000)
