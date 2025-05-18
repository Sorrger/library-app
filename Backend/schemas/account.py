from pydantic import BaseModel
from typing import Optional
from .student import StudentBase
from enum import Enum

class UserRole(str, Enum):
    student = "student"
    librarian = "librarian"
    admin = "admin"

class AccountBase(BaseModel):
    login: str    
    role: UserRole = UserRole.student

class AccountCreate(AccountBase):
    password: str
    student_id: Optional[int] = None

class AccountCreateRequest(AccountBase):
    password: str
    student: Optional[StudentBase] = None

class AccountLoginRequest(BaseModel):
    login: str
    password: str

class AccountUpdate(BaseModel):
    password: Optional[str] = None
    role: Optional[UserRole] = None

class Account(AccountBase):
    account_id: int
    student_id: Optional[int] = None

    class Config:
        orm_mode = True