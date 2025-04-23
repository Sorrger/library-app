from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from crud.account import create_account, get_account_by_login
from schemas.account import AccountCreate, Account
from utils.security import verify_password

router = APIRouter(tags=['auth'])

@router.post("/register", response_model=Account)
def register(account_data: AccountCreate, db: Session = Depends(get_db)):
    existing = get_account_by_login(db, account_data.login)
    if existing:
        raise HTTPException(status_code=400, detail="Login already exists")
    return create_account(db, account_data)

@router.post("/login", response_model=Account)
def login(account_data: AccountCreate, db: Session = Depends(get_db)):
    account = get_account_by_login(db, account_data.login)
    if not account or not verify_password(account_data.password, account.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return account
