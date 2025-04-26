from fastapi import APIRouter, Depends
from schemas.loan import LoanCreate, Loan
from database.database import get_db
from crud.loan import get_all_loans, create_loan

router = APIRouter(tags=['loans'])

@router.get("/loans", response_model=list[Loan])
def get_all_loans_endpoint(db = Depends(get_db)):
    return get_all_loans(db)

@router.post("/loans", response_model=Loan)
def create_loan_endpoint(loan: LoanCreate, db = Depends(get_db)):
    return create_loan(db, loan)