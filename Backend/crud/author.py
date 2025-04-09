from sqlalchemy.orm import Session
from models.author import Author
from schemas.author import AuthorCreate

# == Create ==
def create_author(db: Session, author: AuthorCreate):
    db_author = Author(**author.dict())
    db.add(db_author)
    db.commit()
    db.refresh(db_author)
    return db_author
# == Read ==
def get_all_authors(db: Session):
    return db.query(Author).all()
# == Update ==
# == Delete ==