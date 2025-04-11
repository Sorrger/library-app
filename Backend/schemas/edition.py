from pydantic import BaseModel

class EditionBase(BaseModel):
    status: str
    book_format: str

class EditionCreate(EditionBase):
    book_id: int
    publishing_house_id: int

class Edition(EditionBase):
    edition_id:  int

    class Config:
        orm_mode = True