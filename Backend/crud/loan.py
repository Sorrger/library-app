from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from models.loan import Loan
from models.edition import Edition
from models.student import Student
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

def get_all_loans_by_student_id(db: Session, student_id: int):
    return db.query(Loan).filter(Loan.student_id == student_id).all()

#Dawid tutaj prosze sprawdz czy wszystko okej {CR PLS}
def get_loans_filtered_by_date(db: Session, start_date: datetime, end_date: datetime):
    return db.query(Loan).filter(
        Loan.loan_date >= start_date,
        Loan.loan_date <= end_date
    ).options(
        joinedload(Loan.student),
        joinedload(Loan.edition).joinedload(Edition.book)
    ).all()

def get_returns_filtered_by_date(db: Session, start_date: datetime, end_date: datetime):
    return db.query(Loan).filter(
        Loan.return_date != None,
        Loan.return_date >= start_date,
        Loan.return_date <= end_date
    ).all()

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
def delete_reservation(db:Session, loan_id: int):
    loan = db.query(Loan).filter(Loan.id == loan_id,
                                    Loan.return_date.is_(None)).first
    if not loan: 
        return False
    db.delete(loan)
    db.commit
    