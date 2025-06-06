from sqlalchemy.orm import Session
from models.account import Account, UserRole
from models.student import Student
from schemas.account import AccountCreate, AccountUpdate
from utils.security import hash_password, validate_password_strength

# == Create ==
def create_account(db: Session, account_data: AccountCreate):
    validate_password_strength(account_data.password)
    hashed = hash_password(account_data.password)
    db_account = Account(
        login=account_data.login,
        password=hashed,
        role=account_data.role,
        student_id=account_data.student_id
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


# == Read ==
def get_account_by_login(db: Session, login: str):
    return db.query(Account).filter(Account.login == login).first()


#wypisanie wszystkich bibliotekarzy
def get_all_librarians(db: Session, login: UserRole):
    return db.query(Account).filter(Account.role == login).all()


def get_student_by_data(db: Session, name: str, surname: str, phone_number: str | None):
    query = db.query(Student).filter(
        Student.name == name,
        Student.surname == surname
    )
    if phone_number:
        query = query.filter(Student.phone_number == phone_number)
    return query.first()

def search_accounts_by_login(db: Session, search_term: str):
    return db.query(Account).filter(Account.login.ilike(f"%{search_term}%")).all()

# == Update ==
def update_account(db: Session, account_id: int, update_data: AccountUpdate):
    account = db.query(Account).filter(Account.account_id == account_id).first()
    if not account:
        return None

    if update_data.password:
        validate_password_strength(update_data.password)
        account.password = hash_password(update_data.password)

    if update_data.role:
        account.role = update_data.role

    db.commit()
    db.refresh(account)
    return account

# == Delete ==
def delete_account(db: Session, account_id: int):
    account = db.query(Account).filter(Account.account_id == account_id).first()
    if not account:
        return None
    db.delete(account)
    db.commit()
    return account
