from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base

class Account(Base):
    __tablename__ = "accounts"
    
    account_id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    student_id = Column(Integer, ForeignKey("students.student_id"))

    student = relationship("Student", back_populates="account")