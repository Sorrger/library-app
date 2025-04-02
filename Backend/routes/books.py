from fastapi import APIRouter, Depends, HTTPException
from schemas.book import BookCreate


router = APIRouter()

# @router.get("/books", response_model=list[BookCreate])
# async def get_all_books(db =Depends()):
#     return {"book": db.get_all_books()}


