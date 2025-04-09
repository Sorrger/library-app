from sqlalchemy.orm import Session
from models.genre import Genre
from schemas.genre import GenreCreate


# == Create ==
def create_genre(db: Session, genre: GenreCreate):
    db_genre = Genre(**genre.dict())
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

# == Read ==

def get_all_genres(db: Session):
    return db.query(Genre).all()
# == Update ==
# == Delete ==