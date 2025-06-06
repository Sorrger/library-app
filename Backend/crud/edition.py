from sqlalchemy.orm import Session
from models.student import Student
from models.edition import Edition
from models.enums import EditionStatus
from models.loan import Loan
from schemas.edition import EditionCreate, EditionUpdate

# == Create ==
def create_edition(db: Session, edition: EditionCreate):
    db_edition = Edition(**edition.dict())
    db.add(db_edition)
    db.commit()
    db.refresh(db_edition)
    return db_edition

# == Read ==
def get_all_editions(db: Session):
    return db.query(Edition).all()

def get_edition_by_id(db: Session, edition_id: int):
    return db.query(Edition).filter(Edition.edition_id == edition_id).first()

def get_editions_by_book_id(db: Session, book_id: int):
    return db.query(Edition).filter(Edition.book_id == book_id).all()

def get_all_available_editions(db: Session):
    return db.query(Edition).filter(Edition.status == EditionStatus.AVAILABLE).all()

def get_book_by_edition_id(db: Session, edition_id: int):
    edition = db.query(Edition).filter(Edition.edition_id == edition_id).first()
    if not edition:
        return None
    return edition.book

def get_reservated_loans_with_students(db: Session):
    loans = db.query(Loan) \
              .join(Loan.edition) \
              .join(Loan.student) \
              .filter(Edition.status == EditionStatus.RESERVED) \
              .order_by(Loan.loan_date.desc()) \
              .all()
    
    unique_loans = {}
    for loan in loans:
        if loan.edition.edition_id not in unique_loans:
            unique_loans[loan.edition.edition_id] = loan
    
    return list(unique_loans.values())

def get_reserved_loans_with_students_by_student_id(db: Session, student_id: int):
    loans = db.query(Loan) \
              .join(Loan.edition) \
              .join(Loan.student) \
              .filter(Student.student_id == student_id) \
              .filter(Edition.status == EditionStatus.RESERVED) \
              .order_by(Loan.loan_date.desc()) \
              .all()
    
    unique_loans = {}
    for loan in loans:
        if loan.edition.edition_id not in unique_loans:
            unique_loans[loan.edition.edition_id] = loan
    
    return list(unique_loans.values())

def get_borrowed_loans_with_students(db: Session):
    loans = db.query(Loan) \
              .join(Loan.edition) \
              .join(Loan.student) \
              .filter(Edition.status == EditionStatus.BORROWED) \
              .order_by(Loan.loan_date.desc()) \
              .all()
    
    unique_loans = {}
    for loan in loans:
        if loan.edition.edition_id not in unique_loans:
            unique_loans[loan.edition.edition_id] = loan
    
    return list(unique_loans.values())

def get_borrowed_loans_with_students_by_student_id(db: Session, student_id: int):
    loans = db.query(Loan) \
              .join(Loan.edition) \
              .join(Loan.student) \
              .filter(Student.student_id == student_id) \
              .filter(Edition.status == EditionStatus.BORROWED) \
              .order_by(Loan.loan_date.desc()) \
              .all()
    
    unique_loans = {}
    for loan in loans:
        if loan.edition.edition_id not in unique_loans:
            unique_loans[loan.edition.edition_id] = loan
    
    return list(unique_loans.values())

def get_edition_count(db: Session):
    return db.query(Edition).count()

def get_publisher_by_edition_id(db: Session, edition_id: int):
    edition = db.query(Edition).filter(Edition.edition_id == edition_id).first()
    if not edition:
        return None
    return edition.publishing_house

# == Update ==
def update_edition_status(db: Session, edition_id: int, new_status: EditionStatus):
    edition = db.query(Edition).filter(Edition.edition_id == edition_id).first()
    if not edition:
        return None
    edition.status = EditionStatus(new_status.value)
    db.commit()
    db.refresh(edition)
    return edition


def update_edition(db: Session, edition_id: int, edition_update: EditionUpdate):
    edition = db.query(Edition).filter(Edition.edition_id == edition_id).first()
    if not edition:
        return None

    update_data = edition_update.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(edition, key, value)

    db.commit()
    db.refresh(edition)
    return edition
# == Delete ==
def delete_edition(db: Session, edition_id: int):
    edition = db.query(Edition).filter(Edition.edition_id == edition_id).first()
    if edition is None:
        return None
    db.delete(edition)
    db.commit()
    return edition