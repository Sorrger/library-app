from fastapi import APIRouter, Depends, HTTPException
from schemas.publishing_house import PublishingHouse, PublishingHouseCreate
from database.database import get_db
from crud.publishing_house import get_all_publishing_houses, create_publishing_house, delete_publishing_house_by_id

router = APIRouter(tags=['publishingHouses'])

@router.get("/publishingHouses", response_model=list[PublishingHouse])
def get_all_publishing_houses_endpoint(db = Depends(get_db)):
    return get_all_publishing_houses(db)
    

@router.post("/publishingHouses", response_model=PublishingHouse)
def create_publishing_house_endpoint(publishingHouse: PublishingHouseCreate, db = Depends(get_db)):
    return create_publishing_house(db, publishingHouse)

@router.delete("/publishingHouses/{publishing_house_id}", response_model=PublishingHouse)
def delete_publishing_house_endpoint(publishing_house_id: int, db = Depends(get_db)):
    publishing_house = delete_publishing_house_by_id(db, publishing_house_id)
    if publishing_house is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return publishing_house