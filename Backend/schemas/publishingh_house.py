from pydantic import BaseModel

class PublishingHouseBase(BaseModel):
    name: str
    headquarters: str

class PublishingHouseBaseCreate(PublishingHouseBase):
    pass 

class PublishingHouse(PublishingHouseBase):
    Publishing_House_id: int
    
    class Config:
        orm_mode = True