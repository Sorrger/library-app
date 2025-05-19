from fastapi import APIRouter, Depends, HTTPException
from schemas.student import StudentCreate, Student, StudentLimitsResponse
from database.database import get_db
from crud.student import get_all_students, create_student, get_student_by_id, increase_books_limit_by_id, decrease_books_limit_by_id

router = APIRouter(tags=['students'])

@router.get("/students", response_model=list[Student])
def get_all_students_endpoint(db = Depends(get_db)):
    return get_all_students(db)


@router.post("/students", response_model=StudentLimitsResponse)
def create_student_endpoint(student: StudentCreate, db = Depends(get_db)):
    return create_student(db, student)

@router.get("/students/{student_id}", response_model=StudentLimitsResponse)
def get_student_by_id_endpoint(student_id: int, db = Depends(get_db)):
    db_student = get_student_by_id(db=db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@router.patch("/students/{student_id}/limit-increase", response_model=StudentLimitsResponse)
def increase_student_limit(student_id: int, db=Depends(get_db)):
    student = increase_books_limit_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.patch("/students/{student_id}/limit-decrease", response_model=StudentLimitsResponse)
def decrease_student_limit(student_id: int, db=Depends(get_db)):
    student = decrease_books_limit_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student