from pydantic import BaseModel
from typing import List
from book import Book

class GenreBase(BaseModel):
    name: str


class GenreCreate(GenreBase):
    pass


class Genre(GenreBase):
    genre_id: int
    books: List[Book] = []  

    class Config:
        orm_mode = True
