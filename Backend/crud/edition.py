from sqlalchemy.orm import Session
from models.edition import Edition
from schemas.edition import EditionCreate, EditionStatus

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

def get_editions_by_book_id(db: Session, book_id: int):
    return db.query(Edition).filter(Edition.book_id == book_id).all()

def get_all_available_editions(db: Session):
    return db.query(Edition).filter(Edition.status == "available").all()

# == Update ==
def update_edition_status(db: Session, edition_id: int, new_status: EditionStatus):
    edition = db.query(Edition).filter(Edition.edition_id == edition_id).first()
    if not edition:
        return None
    edition.status = new_status
    db.commit()
    db.refresh(edition)
    return edition
# == Delete ==