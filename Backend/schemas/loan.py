from datetime import datetime
from pydantic import BaseModel

class LoanBase(BaseModel):
    loan_date: datetime
    return_date: datetime

class LoanCreate(LoanBase):
    student_id: int
    edition_id: int

class Loan(LoanBase):
    loan_id: int

    class Config:
        orm_mode = True