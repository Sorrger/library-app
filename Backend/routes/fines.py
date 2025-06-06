from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from schemas.fine import FineCreate, FineUpdate, Fine
from database.database import get_db
from crud.fine import create_fine, get_all_fines, get_fine, update_fine, delete_fine, mark_fine_as_paid

router = APIRouter(tags=["fines"])

@router.get("/fines", response_model=List[Fine])
def get_all_fines_endpoint(db = Depends(get_db)):
    return get_all_fines(db)

@router.post("/fines", response_model=Fine)
def create_fine_endpoint(fine: FineCreate, db = Depends(get_db)):
    return create_fine(db, fine)

@router.get("/fines/{fine_id}", response_model=Fine)
def get_fine_endpoint(fine_id: int, db = Depends(get_db)):
    return get_fine(db, fine_id)

@router.put("/fines/{fine_id}", response_model=Fine)
def update_fine_endpoint(fine_id: int, fine_data: FineUpdate, db = Depends(get_db)):
    return update_fine(db, fine_id, fine_data)

@router.delete("/fines/{fine_id}")
def delete_fine_endpoint(fine_id: int, db = Depends(get_db)):
    return delete_fine(db, fine_id)

@router.patch("/fines/{fine_id}/pay", response_model=Fine)
def pay_fine_endpoint(fine_id: int, db = Depends(get_db)):
    fine = mark_fine_as_paid(db, fine_id)
    if not fine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fine not found")
    return fine
