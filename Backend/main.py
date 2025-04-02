from fastapi import FastAPI
import uvicorn
from Backend.routes import books

app = FastAPI()
#app.include_router(books)


if __name__ == "__main__":
    uvicorn.run(app, host ="0.0.0.0", port = 8000)