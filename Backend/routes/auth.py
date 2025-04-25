from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from crud.account import create_account, get_account_by_login, get_student_by_data
from schemas.account import AccountCreate, Account, AccountCreateRequest
from utils.security import verify_password

router = APIRouter(tags=['auth'])

@router.post("/register", response_model=Account)
def register(account_data: AccountCreateRequest, db: Session = Depends(get_db)):
    existing = get_account_by_login(db, account_data.login)
    if existing:
        raise HTTPException(status_code=400, detail="Login already exists")

    student = get_student_by_data(
        db,
        account_data.student.name,
        account_data.student.surname,
        account_data.student.phone_number
    )
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    account = AccountCreate(
        login=account_data.login,
        password=account_data.password,
        student_id=student.student_id
    )
    return create_account(db, account)


@router.post("/login", response_model=Account)
def login(account_data: AccountCreate, db: Session = Depends(get_db)):
    account = get_account_by_login(db, account_data.login)
    if not account or not verify_password(account_data.password, account.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return account
