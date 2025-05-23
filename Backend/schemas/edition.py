from pydantic import BaseModel
from typing import Optional
from .publishing_house import PublishingHouse
from models.enums import EditionStatus

class EditionBase(BaseModel):
    status: EditionStatus
    book_format: str

class EditionCreate(EditionBase):
    book_id: int
    publishing_house_id: int

    
class EditionStatusUpdate(BaseModel):
    status: EditionStatus

class Edition(EditionBase):
    edition_id:  int
    publishing_house: Optional[PublishingHouse] = None 

    class Config:
        orm_mode = True
