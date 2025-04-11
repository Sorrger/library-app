from pydantic import BaseModel
from typing import Optional

class PublishingHouseBase(BaseModel):
    name: str
    headquarters: Optional[str]

class PublishingHouseCreate(PublishingHouseBase):
    pass 

class PublishingHouse(PublishingHouseBase):
    publishing_house_id: int
    
    class Config:
        orm_mode = True