from fastapi import APIRouter, Depends
from schemas.student import StudentCreate, Student
from database.database import get_db
from crud.student import get_all_students, create_student

router = APIRouter(tags=['students'])

@router.get("/students", response_model=list[Student])
def get_all_students_endpoint(db = Depends(get_db)):
    return get_all_students(db)

@router.post("/students", response_model=Student)
def create_student_endpoint(student: StudentCreate, db = Depends(get_db)):
    return create_student(db, student)
