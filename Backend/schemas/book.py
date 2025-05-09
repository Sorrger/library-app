from pydantic import BaseModel
from .author import Author
from .genre import Genre
from typing import List
from datetime import date

class BookBase(BaseModel):
    title: str
    release_date: date
    

class BookCreate(BookBase):
    pass

class Book(BookBase):
    book_id: int
    authors: List[Author]  
    genres: List[Genre]  

    class Config:
        orm_mode = True
 