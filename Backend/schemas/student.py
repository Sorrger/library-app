from pydantic import BaseModel
from typing import Optional

class StudentBase(BaseModel):
    name: str
    surname: str
    phone_number: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    student_id: int

    class Config:
        orm_mode = True
