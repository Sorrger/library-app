from fastapi import APIRouter, Depends
from schemas.publishing_house import PublishingHouse, PublishingHouseCreate
from database.database import get_db
from crud.publishing_house import get_all_publishing_houses, create_publishing_house

router = APIRouter(tags=['publishingHouses'])

@router.get("/publishingHouses", response_model=list[PublishingHouse])
def get_all_publishing_houses_endpoint(db = Depends(get_db)):
    return get_all_publishing_houses(db)
    

@router.post("/publishingHouses", response_model=PublishingHouse)
def create_publishing_house_endpoint(publishingHouse: PublishingHouseCreate, db = Depends(get_db)):
    return create_publishing_house(db, publishingHouse)
