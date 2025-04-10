from pydantic import BaseModel
from typing import List
from .author import Author
from .genre import Genre

class BookBase(BaseModel):
    title: str
    

class BookCreate(BookBase):
    pass

class Book(BookBase):
    book_id: int
    authors: List[Author] = []  
    genres: List[Genre] = []  

    class Config:
        orm_mode = True