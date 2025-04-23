from pydantic import BaseModel

class AccountBase(BaseModel):
    login: str    

class AccountCreate(AccountBase):
    password: str
    student_id: int

class Account(AccountBase):
    account_id: int
    student_id: int

    class Config:
        orm_mode = True