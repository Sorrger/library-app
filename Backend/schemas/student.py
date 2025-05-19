from pydantic import BaseModel
from typing import Optional

class StudentBase(BaseModel):
    name: str
    surname: str
    phone_number: Optional[str] = None

class StudentCreate(StudentBase):
    pass

class StudentLimitsResponse(StudentBase):
    books_limit: int

class Student(StudentBase):
    student_id: int

    class Config:
        orm_mode = True
