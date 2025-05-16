from pydantic import BaseModel
from .author import Author
from .genre import Genre
from typing import List, Optional
from datetime import date

class BookBase(BaseModel):
    title: str
    release_date: date
    

class BookCreate(BookBase):
    author_ids: List[int] = []
    genre_ids: List[int] = []

class BookResponse(BaseModel):
    book_id: int
    title: str
    release_date: date
    authors: List[Author] = []
    genres: List[Genre] = []

class Book(BookBase):
    book_id: int
    authors: Optional[List[Author]] = []
    genres: Optional[List[Genre]] = []

    class Config:
        orm_mode = True
 