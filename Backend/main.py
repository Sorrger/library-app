from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes import books, authors, genres, publishing_houses, editions, student, loan, auth, admin
from database import create_tables
from fastadmin import fastapi_app as admin_app

app = FastAPI()
app.include_router(books.router)
app.include_router(authors.router)
app.include_router(genres.router)
app.include_router(editions.router)
app.include_router(publishing_houses.router)
app.include_router(student.router)
app.include_router(loan.router)
app.include_router(auth.router)
app.include_router(admin.router)  

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/admin", admin_app)

create_tables()


if __name__ == "__main__":
    uvicorn.run(app, host ="127.0.0.1", port = 8000)

#TO DO :
# -> pagination 
# -> book need author to create