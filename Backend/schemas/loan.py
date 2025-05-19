from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from .edition import Edition
from .student import Student

class LoanBase(BaseModel):
    loan_date: datetime
    return_date: Optional[datetime] = None 

class LoanCreate(LoanBase):
    student_id: int
    edition_id: int
    
class LoanCreateWithoutStudent(LoanBase):
    edition_id: int

class LoanWithRelations(BaseModel):
    loan_id: int
    edition: Edition
    student: Student

    class Config:
        orm_mode = True

class Loan(LoanBase):
    loan_id: int
    student_id: int
    edition_id: int

    class Config:
        orm_mode = True