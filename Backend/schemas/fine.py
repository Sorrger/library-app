from pydantic import BaseModel
from typing import List
from models.enums import FineTypeEnum

class FineStudentAssociation(BaseModel):
    student_id: int
    name: str
    surname: str
    is_paid: bool

    class Config:
        orm_mode = True

class FineStudentResponse(BaseModel):
    fine_id: int
    student_id: int
    is_paid: bool
    fine_type: FineTypeEnum
    value: int
    class Config:
        orm_mode = True

        
class FinePayRequest(BaseModel):
    student_id: int

class FineStudentWithDetails(BaseModel):
    fine_id: int
    student_id: int
    is_paid: bool
    fine_type: FineTypeEnum
    value: int
    student_name: str
    student_surname: str

    class Config:
        orm_mode = True

class FineBase(BaseModel):
    fine_type: FineTypeEnum
    value: int

class Fine(FineBase):
    fine_id: int
    students: List[FineStudentAssociation] = []

    class Config:
        orm_mode = True
