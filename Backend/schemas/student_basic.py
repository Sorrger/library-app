from pydantic import BaseModel
from typing import Optional

class StudentBasic(BaseModel):
    student_id: int
    name: str
    surname: str
    is_paid: Optional[bool] = None 

    class Config:
        orm_mode = True
