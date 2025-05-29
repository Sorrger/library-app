from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from models.loan import Loan
from models.edition import EditionStatus
from schemas.loan import LoanCreate
from datetime import datetime

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

def get_active_borrowings_count(db:Session):
    return db.query(Loan).filter(Loan.return_date == None).count()

def get_all_loans_count(db: Session):
    return db.query(Loan).count()

# == Update ==

def mark_loan_as_returned(db: Session, edition_id: int):
    loan = db.query(Loan).filter(
        Loan.edition_id == edition_id,
        Loan.return_date == None
    ).first()

    if loan:
        loan.return_date = datetime.utcnow()
        db.commit()
        db.refresh(loan)
    return loan

# == Delete ==
def delete_reservation(db: Session, loan_id: int):
    loan = (
        db.query(Loan)
          .options(joinedload(Loan.edition))
          .filter(
              Loan.id == loan_id,
              Loan.return_date.is_(None)
          )
          .first()
    )
    if not loan:
        return False
    loan.edition.status = EditionStatus.AVAILABLE

    db.delete(loan)
    db.commit()
    return True