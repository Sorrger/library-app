from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class LoanBase(BaseModel):
    loan_date: datetime
    return_date: Optional[datetime] = None 

class LoanCreate(LoanBase):
    student_id: int
    edition_id: int

class Loan(LoanBase):
    loan_id: int
    student_id: int
    edition_id: int

    class Config:
        orm_mode = True