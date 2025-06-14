from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from .edition import  Edition

class FineStudent(Base):
    __tablename__ = "fine_student"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fine_id = Column(Integer, ForeignKey("fines.fine_id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.student_id"), nullable=False)
    is_paid = Column(Boolean, default=False)
    edition_id = Column(Integer, ForeignKey("editions.edition_id"), nullable=False)

    fine = relationship("Fine", back_populates="fine_associations")
    student = relationship("Student", back_populates="fine_associations")
    edition = relationship("Edition")

