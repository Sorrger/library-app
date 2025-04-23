from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes import books, authors, genres, publishing_houses, editions, auth
from database import create_tables

app = FastAPI()
app.include_router(books.router)
app.include_router(authors.router)
app.include_router(genres.router)
app.include_router(editions.router)
app.include_router(publishing_houses.router)
app.include_router(auth.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_tables()

if __name__ == "__main__":
    uvicorn.run(app, host ="127.0.0.1", port = 8000)
