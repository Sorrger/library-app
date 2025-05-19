from fastapi import APIRouter, Depends, HTTPException
from schemas.loan import LoanCreate, Loan, LoanCreateWithoutStudent, LoanWithRelations
from database.database import get_db
from crud.loan import get_all_loans, create_loan
from crud.edition import get_reservated_loans_with_students

router = APIRouter(tags=['loans'])

@router.get("/loans", response_model=list[Loan])
def get_all_loans_endpoint(db = Depends(get_db)):
    return get_all_loans(db)

@router.post("/loans", response_model=Loan)
def create_loan_endpoint(loan: LoanCreate, db = Depends(get_db)):
    return create_loan(db, loan)

@router.get("/loans/reservated", response_model=list[LoanWithRelations])
def get_borrowed_loans_with_students_endpoint(db = Depends(get_db)):
    return get_reservated_loans_with_students(db)

@router.post("/students/{student_id}/loans", response_model=Loan)
def create_loan_for_student(student_id: int, loan_data: LoanCreateWithoutStudent, db = Depends(get_db)):
    loan = LoanCreate(
        student_id=student_id,
        edition_id=loan_data.edition_id,
        loan_date=loan_data.loan_date
    )

    try:
        return create_loan(db, loan)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))