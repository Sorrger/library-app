from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database.database import Base
from .association_tables import fine_student

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

    fines = relationship(
    "Fine",
    secondary=fine_student,
    back_populates="students"
)

