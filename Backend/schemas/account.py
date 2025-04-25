from pydantic import BaseModel
from .student import StudentBase

class AccountBase(BaseModel):
    login: str    

class AccountCreate(AccountBase):
    password: str
    student_id: int

class AccountCreateRequest(AccountBase):
    password: str
    student: StudentBase

class Account(AccountBase):
    account_id: int
    student_id: int

    class Config:
        orm_mode = True