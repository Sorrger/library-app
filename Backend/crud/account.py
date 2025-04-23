from sqlalchemy.orm import Session
from models.account import Account
from schemas.account import AccountCreate
from utils.security import hash_password, validate_password_strength

# == Create ==
def create_account(db: Session, account_data: AccountCreate):
    validate_password_strength(account_data.password)
    hashed = hash_password(account_data.password)
    db_account = Account(
        login=account_data.login,
        password=hashed,
        student_id=account_data.student_id
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

# == Read ==
def get_account_by_login(db: Session, login: str):
    return db.query(Account).filter(Account.login == login).first()
# == Update ==
# == Delete ==