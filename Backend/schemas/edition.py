from pydantic import BaseModel

class EditionBase(BaseModel):
    status = str
    book_format = str

class EditionCreate(EditionBase):
    pass

class Edition(EditionBase):
    edition_id: int
    book_id: int
    publishingHouse_id: int

    class Config:
        orm_mode = True