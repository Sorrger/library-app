from pydantic import BaseModel
from typing import Optional

class FineBase(BaseModel):
    description: str
    value: int
    is_paid: bool = False

class FineCreate(FineBase):
    pass

class FineUpdate(BaseModel):
    description: Optional[str] = None
    value: Optional[int] = None
    is_paid: Optional[bool] = None

class Fine(FineBase):
    fine_id: int
    class Config:
        orm_mode = True