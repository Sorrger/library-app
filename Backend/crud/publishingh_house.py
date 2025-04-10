from sqlalchemy.orm import Session
from models.publishingh_house import PublishingHouse
from schemas.publishingh_house import PublishingHouseBaseCreate


# == Create ==
def create_publishing_house(db: Session, genre: PublishingHouseBaseCreate):
    db_genre = PublishingHouse(**genre.dict())
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre

# == Read ==

def get_all_publishing_houses(db: Session):
    return db.query(PublishingHouse).all()
# == Update ==
# == Delete ==