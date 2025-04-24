from sqlalchemy.orm import Session
from models.publishing_house import PublishingHouse
from schemas.publishing_house import PublishingHouseCreate


# == Create ==
def create_publishing_house(db: Session, Publishing_House: PublishingHouseCreate):
    db_publishing_house = PublishingHouse(**Publishing_House.dict())
    db.add(db_publishing_house)
    db.commit()
    db.refresh(db_publishing_house)
    return db_publishing_house

# == Read ==

def get_all_publishing_houses(db: Session):
    return db.query(PublishingHouse).all()

# == Update ==
# == Delete ==