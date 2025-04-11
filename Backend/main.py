from fastapi import FastAPI
import uvicorn
from routes import books, authors, genres, publishing_houses, editions
from database import create_tables

app = FastAPI()
app.include_router(books.router)
app.include_router(authors.router)
app.include_router(genres.router)
app.include_router(editions.router)
app.include_router(publishing_houses.router)




if __name__ == "__main__":
    #create_tables()
    uvicorn.run(app, host ="127.0.0.1", port = 8000)

#2. Enum do wyboru statusu egzemplarza
#3. zaisntalowanie reacta i axios