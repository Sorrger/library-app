from fastapi import APIRouter, Depends
from schemas.publishingh_house import PublishingHouse, PublishingHouseBaseCreate
from database.database import get_db
from crud.publishingh_house import get_all_publishing_houses, create_publishing_house

router = APIRouter(tags=['publishinghouse'])

@router.get("/publishinghouse", response_model=list[PublishingHouse])
def get_all_publishing_houses_endpoint(db = Depends(get_db)):
    return get_all_publishing_houses(db)
    

@router.post("/publishinghouse", response_model=PublishingHouse)
def create_publishing_house_endpoint(genre: PublishingHouseBaseCreate, db = Depends(get_db)):
    return create_publishing_house(db, genre)
