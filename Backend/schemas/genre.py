from pydantic import BaseModel

class GenreBase(BaseModel):
    name: str


class GenreCreate(GenreBase):
    pass


class Genre(GenreBase):
    genre_id: int

    class Config:
        orm_mode = True
