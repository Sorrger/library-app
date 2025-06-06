from pydantic import BaseModel
from typing import Optional
from .publishing_house import PublishingHouse
from .book import Book
from models.enums import EditionStatus

class EditionBase(BaseModel):
    status: EditionStatus
    book_format: str

class EditionCreate(EditionBase):
    book_id: int
    publishing_house_id: int

class EditionUpdate(BaseModel):
    status: Optional[EditionStatus] = None
    book_format: Optional[str] = None
    book_id: Optional[int] = None
    publishing_house_id: Optional[int] = None

class EditionStatusUpdate(BaseModel):
    status: EditionStatus

class Edition(EditionBase):
    edition_id:  int
    book: Book
    publishing_house: Optional[PublishingHouse] = None 

    class Config:
        orm_mode = True
