from sqlalchemy.orm import Session
from models.edition import Edition
from schemas.edition import EditionCreate

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

# == Update ==
# == Delete ==