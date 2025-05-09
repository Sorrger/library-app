from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.student import Student
from crud.student import create_student
from schemas.student import StudentCreate 
from models.account import Account, UserRole
from database.database import get_db
from utils.security import hash_password, generate_random_password, validate_password_strength

router = APIRouter(tags=["admin"])

@router.post("/add_student")
def add_student(student_data: StudentCreate, db: Session = Depends(get_db)):
    existing_student = db.query(Student).filter(
        Student.name == student_data.name, 
        Student.surname == student_data.surname
    ).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Student already exists.")
    
    new_student = create_student(db, student_data)
    return new_student

@router.post("/add_admin")
def add_admin(admin_data: dict, db: Session = Depends(get_db)):
    existing_account = db.query(Account).filter(Account.login == admin_data["login"].lower()).first()
    if existing_account:
        raise HTTPException(status_code=400, detail="Login already exists.")
    
    password = admin_data.get("password", generate_random_password())
    
    try:
        validate_password_strength(password)
    except ValueError as e:
        return {"error": str(e)}
    
    hashed_password = hash_password(password)
    
    new_account = Account(
        login=admin_data["login"].lower(),
        password=hashed_password,
        role=UserRole.admin,
        student_id=None
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    
    return {
        "message": "Admin added successfully", 
        "admin": new_account,
        "generated_password": password if admin_data.get("password") is None else None
    }

@router.post("/add_librarian")
def add_librarian(librarian_data: dict, db: Session = Depends(get_db)):
    existing_account = db.query(Account).filter(Account.login == librarian_data["login"].lower()).first()
    if existing_account:
        raise HTTPException(status_code=400, detail="Login already exists.")

    password = librarian_data.get("password", generate_random_password())
    
    try:
        validate_password_strength(password)
    except ValueError as e:
        return {"error": str(e)}
    
    hashed_password = hash_password(password)
    
    new_account = Account(
        login=librarian_data["login"].lower(),
        password=hashed_password,
        role=UserRole.librarian,
        student_id=None
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    
    return {
        "message": "Librarian added successfully", 
        "librarian": new_account,
        "generated_password": password if librarian_data.get("password") is None else None
    }
