from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from models.fine import Fine, FineTypeEnum
from models.edition import Edition
from models.student import Student
from models.fine_students import FineStudent
from schemas.fine import FineBase
from crud.student import get_student_by_id


# == Tworzenie nowej kary ==
def create_fine(db: Session, fine_data: FineBase) -> Fine:
    fine = Fine(
        value=fine_data.value,
        fine_type=FineTypeEnum(fine_data.fine_type)
    )
    db.add(fine)
    db.commit()
    db.refresh(fine)
    return fine


# == Przypisanie studenta do kary ==
def add_student_to_fine(db: Session, fine_id: int, student_id: int, edition_id: int) -> FineStudent:
    fine = db.query(Fine).filter(Fine.fine_id == fine_id).first()
    student = get_student_by_id(db, student_id)
    if not fine or not student:
        raise ValueError("Fine or Student not found")
    now = datetime.utcnow()
    association = FineStudent(
        fine_id=fine_id,
        student_id=student_id,
        edition_id=edition_id,
        is_paid=False,
        assigned_at=now
    )
    db.add(association)
    db.commit()
    db.refresh(association)
    return association

# == Zwrócenie wszystkich kar ==
def get_all_fines(db: Session, skip: int = 0, limit: int = 100) -> list[Fine]:
    return db.query(Fine).offset(skip).limit(limit).all()


def get_fines_filtered_by_date(db: Session, start_date: datetime, end_date: datetime):
    return db.query(FineStudent).filter(
        FineStudent.assigned_at >= start_date,
        FineStudent.assigned_at <= end_date
    ).options(
        joinedload(FineStudent.fine),
        joinedload(FineStudent.student),
        joinedload(FineStudent.edition).joinedload(Edition.book)
    ).all()
# == Oznaczenie kary jako opłaconej dla danego studenta ==
def mark_fine_as_paid(db: Session, fine_id: int, student_id: int) -> FineStudent | None:
    assoc = db.query(FineStudent).filter_by(fine_id=fine_id, student_id=student_id).first()
    if not assoc:
        return None
    assoc.paid_at = datetime.utcnow()
    assoc.is_paid = True
    db.commit()
    db.refresh(assoc)
    return assoc
