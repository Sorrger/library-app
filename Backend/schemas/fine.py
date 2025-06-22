from pydantic import BaseModel
from typing import List, Optional
from models.enums import FineTypeEnum
from datetime import datetime

class FineStudentAssociation(BaseModel):
    student_id: int
    name: str
    surname: str
    is_paid: bool

    class Config:
        orm_mode = True

class FineStudentResponse(BaseModel):
    fine_id: int
    title: Optional[str] = None
    student_id: int
    is_paid: bool
    fine_type: FineTypeEnum
    value: int
    class Config:
        orm_mode = True

class FineAssignRequest(BaseModel):
    edition_id: int
        
class FinePayRequest(BaseModel):
    student_id: int

class FineStudentWithRelations(BaseModel):
    fine_id: int
    student_id: int
    is_paid: bool
    fine_type: FineTypeEnum
    value: int
    assigned_at: datetime
    paid_at: Optional[datetime]
    title: Optional[str]
    student_name: str
    student_surname: str

    class Config:
        orm_mode = True

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
