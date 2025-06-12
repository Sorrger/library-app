from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from schemas.fine import FineBase, Fine, FineStudentResponse,FineStudentWithDetails, FinePayRequest
from typing import List
from crud.fine import create_fine, get_all_fines, mark_fine_as_paid, add_student_to_fine
from database.database import get_db
from models.fine_students import FineStudent

router = APIRouter(tags=["fines"])

@router.get("/fines", response_model=List[Fine])
def get_all_fines_endpoint(db: Session = Depends(get_db)):
    return get_all_fines(db)

@router.get("/students/{student_id}/fines", response_model=List[FineStudentResponse])
def get_fines_for_student(student_id: int, db: Session = Depends(get_db)):
    fines = (
        db.query(FineStudent)
        .filter(FineStudent.student_id == student_id)
        .options(joinedload(FineStudent.fine))
        .all()
    )

    if not fines:
        return [] 

    return [
        FineStudentResponse(
            fine_id=fs.fine_id,
            student_id=fs.student_id,
            is_paid=fs.is_paid,
            fine_type=fs.fine.fine_type,
            value=fs.fine.value
        )
        for fs in fines
    ]

@router.post("/fines/{fine_id}/students/{student_id}", response_model=FineStudentResponse)
def assign_fine_to_student(fine_id: int, student_id: int, db: Session = Depends(get_db)):
    try:
        fs = add_student_to_fine(db, fine_id, student_id)
        fine = fs.fine  # zakładamy, że relacja jest dostępna

        return FineStudentResponse(
            fine_id=fs.fine_id,
            student_id=fs.student_id,
            is_paid=fs.is_paid,
            fine_type=fine.fine_type,
            value=fine.value
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/fines", response_model=Fine)
def create_fine_endpoint(fine: FineBase, db: Session = Depends(get_db)):
    return create_fine(db, fine)

@router.patch("/fines/{fine_id}/pay", response_model=FineStudentResponse)
def pay_fine_endpoint(fine_id: int, body: FinePayRequest, db: Session = Depends(get_db)):
    fine_student = mark_fine_as_paid(db, fine_id, body.student_id)

    if not fine_student:
        raise HTTPException(status_code=404, detail="Fine or assignment not found")

    fine = fine_student.fine  # relacja do Fine

    return FineStudentResponse(
        fine_id=fine_student.fine_id,
        student_id=fine_student.student_id,
        is_paid=fine_student.is_paid,
        fine_type=fine.fine_type,
        value=fine.value
    )

@router.post("/fines/{fine_id}/students/{student_id}", response_model=FineStudentResponse)
def assign_fine_to_student(fine_id: int, student_id: int, db: Session = Depends(get_db)):
    try:
        return add_student_to_fine(db, fine_id, student_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/fines/students", response_model=List[FineStudentWithDetails])
def get_all_fine_assignments(db: Session = Depends(get_db)):
    fine_students = (
        db.query(FineStudent)
        .options(joinedload(FineStudent.fine), joinedload(FineStudent.student))
        .all()
    )

    result = []
    for fs in fine_students:
        result.append(FineStudentWithDetails(
            fine_id=fs.fine_id,
            student_id=fs.student_id,
            is_paid=fs.is_paid,
            fine_type=fs.fine.fine_type,
            value=fs.fine.value,
            student_name=fs.student.name,
            student_surname=fs.student.surname
        ))

    return result