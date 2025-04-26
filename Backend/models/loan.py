from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base

class Loan(Base):
    __tablename__ = "loans"

    loan_id = Column(Integer, primary_key=True, index=True)
    loan_date = Column(DateTime, nullable=False)
    return_date = Column(DateTime, nullable=True)

    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    edition_id = Column(Integer, ForeignKey("editions.edition_id"), nullable=False)

    student = relationship("Student", back_populates="loans")
    edition = relationship("Edition", back_populates="loans")