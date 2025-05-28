from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database.database import get_db
from models.account import Account as AccountModel, UserRole
from models.student import Student
from crud.student import create_student
from utils.security import hash_password

import schemas.student as schemas_student
from schemas.account import Account as AccountSchema, AccountCreate, AccountUpdate

from utils.security import hash_password, validate_password_strength
router = APIRouter(tags=["admin"])


@router.post(
    "/add_student",
    response_model=schemas_student.Student,
    summary="Dodaj nowego studenta"
)
def add_student(
    student_data: schemas_student.StudentCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(Student)
          .filter(
              Student.name == student_data.name,
              Student.surname == student_data.surname
          )
          .first()
    )
    if existing:
        raise HTTPException(400, "Student o takich danych już istnieje.")
    return create_student(db, student_data)


@router.post(
    "/add_admin",
    response_model=AccountSchema,
    summary="Dodaj nowego administratora"
)
def add_admin(
    admin_data: AccountCreate,
    db: Session = Depends(get_db)
):
    login_lower = admin_data.login.lower()
    if db.query(AccountModel).filter(AccountModel.login == login_lower).first():
        raise HTTPException(400, "Login już istnieje.")
    hashed = hash_password(admin_data.password)
    new = AccountModel(
        login=login_lower,
        password=hashed,
        role=UserRole.admin
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@router.post(
    "/add_librarian",
    response_model=AccountSchema,
    summary="Dodaj nowego bibliotekarza"
)
def add_librarian(
    librarian_data: AccountCreate,
    db: Session = Depends(get_db)
):
    login_lower = librarian_data.login.lower()
    if db.query(AccountModel).filter(AccountModel.login == login_lower).first():
        raise HTTPException(400, "Login już istnieje.")
    hashed = hash_password(librarian_data.password)
    new = AccountModel(
        login=login_lower,
        password=hashed,
        role=UserRole.librarian
    )
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@router.get(
    "/account",
    response_model=AccountSchema,
    summary="Pobierz konto po unikalnym loginie"
)
def get_account_by_login(
    login: str = Query(..., description="Dokładny login (unikalny), case-insensitive"),
    db: Session = Depends(get_db)
):
    account = (
        db.query(AccountModel)
          .filter(AccountModel.login.ilike(login))
          .first()
    )
    if not account:
        raise HTTPException(404, "Konto nie znalezione")
    return account


@router.patch("/account/{account_id}", response_model=AccountSchema)
def update_account(
    account_id: int,
    data: AccountUpdate,
    db: Session = Depends(get_db)
):
    account = db.query(AccountModel).filter(AccountModel.account_id == account_id).first()
    if not account:
        raise HTTPException(404, "Konto nie znalezione")
    if data.password:
        validate_password_strength(data.password)
        account.password = hash_password(data.password)
    if data.role:
        account.role = data.role
    db.commit()
    db.refresh(account)
    return account