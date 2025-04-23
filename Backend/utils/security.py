from passlib.context import CryptContext
from password_validator import PasswordValidator

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

schema = PasswordValidator()
schema.min(8).has().uppercase().has().lowercase().has().digits().has().symbols()

def validate_password_strength(password: str):
    if not schema.validate(password):
        raise ValueError("Password is not strong enough.")
