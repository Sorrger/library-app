from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database.database import get_db
from crud.account import create_account, get_account_by_login, get_student_by_data
from schemas.account import AccountCreate, Account, AccountCreateRequest, AccountLoginRequest
from utils.security import verify_password
from utils.jwt import create_access_token, verify_token

router = APIRouter(tags=['auth'])

@router.post("/register", response_model=Account)
def register(account_data: AccountCreateRequest, db: Session = Depends(get_db)):
    existing = get_account_by_login(db, account_data.login)
    if existing:
        raise HTTPException(status_code=400, detail="Login already exists")

    student_id = None

    if account_data.role == "student":
        if not account_data.student:
            raise HTTPException(status_code=400, detail="Student data required for student role")

        student = get_student_by_data(
            db,
            account_data.student.name,
            account_data.student.surname,
            account_data.student.phone_number
        )
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        student_id = student.student_id

    account = AccountCreate(
        login=account_data.login,
        password=account_data.password,
        student_id=student_id,
        role=account_data.role.value
    )
    return create_account(db, account)



@router.post("/login")
def login(account_data: AccountLoginRequest, db: Session = Depends(get_db)):
    account = get_account_by_login(db, account_data.login)
    if not account or not verify_password(account_data.password, account.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({
        "sub": account.login,
        "account_id": account.account_id,
        "role": str(account.role)
    })

    print(account.role)
    return {"access_token": token, "token_type": "bearer"}


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") 
@router.get("/me", response_model=Account)
def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    login = payload.get("sub")
    if not login:
        raise HTTPException(status_code=401, detail="Invalid token")

    account = get_account_by_login(db, payload.get("sub"))
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    

    return account
