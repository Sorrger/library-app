from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base

class FineStudent(Base):
    __tablename__ = "fine_student"

    fine_id = Column(Integer, ForeignKey("fines.fine_id"), primary_key=True)
    student_id = Column(Integer, ForeignKey("students.student_id"), primary_key=True)
    is_paid = Column(Boolean, default=False)

    fine = relationship("Fine", back_populates="fine_associations")
    student = relationship("Student", back_populates="fine_associations")
