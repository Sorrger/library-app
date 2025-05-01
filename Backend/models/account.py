from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
import enum

class UserRole(enum.Enum):
    student = "student"
    librarian = "librarian"
    admin = "admin"

class Account(Base):
    __tablename__ = "accounts"
    
    account_id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.student)

    student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=True)

    student = relationship("Student", back_populates="account")