from pydantic import BaseModel
from typing import List
class GenreBase(BaseModel):
    name: str


class GenreCreate(GenreBase):
    pass


class Genre(GenreBase):
    genre_id: int

    class Config:
        from_attributes = True
