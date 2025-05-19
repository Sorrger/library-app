from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from models.loan import Loan
from schemas.loan import LoanCreate


# == Create ==

def create_loan(db: Session, loan: LoanCreate):
    existing_loan = db.query(Loan).filter(
        Loan.edition_id == loan.edition_id,
        (Loan.return_date > loan.loan_date) | (Loan.return_date == None)
    ).first()

    if existing_loan:
        raise ValueError("Edycja jest już wypożyczona w tym czasie.")

    db_loan = Loan(**loan.dict())
    db.add(db_loan)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError("Błąd unikalności: edycja jest już wypożyczona w tym czasie.")
    db.refresh(db_loan)
    return db_loan


# == Read ==
def get_all_loans(db: Session):
    return db.query(Loan).all()
# == Update ==
# == Delete ==