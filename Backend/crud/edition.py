from sqlalchemy.orm import Session
from models.edition import Edition
from schemas.edition import EditionCreate

# == Create ==
def create_edition(db: Session, genre: EditionCreate):
    db_genre = Edition(**genre.dict())
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

# == Read ==

def get_all_editions(db: Session):
    return db.query(Edition).all()
# == Update ==
# == Delete ==