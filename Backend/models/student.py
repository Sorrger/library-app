from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database.database import Base
from .fine_students import FineStudent

class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    books_limit = Column(Integer, default=5)

    account = relationship(
    "Account",
    back_populates="student", 
    uselist=False) 

    loans = relationship(
    "Loan",
    back_populates="student") 

    fine_associations = relationship("FineStudent", back_populates="student", cascade="all, delete-orphan")

