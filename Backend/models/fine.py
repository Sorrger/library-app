from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from database.database import Base
from .association_tables import fine_student

class Fine(Base):
    __tablename__ = "fines"

    fine_id = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String(255), nullable=False)
    value = Column(Integer, nullable=False)
    is_paid = Column(Boolean, default=False)

    students = relationship(
        "Student",
        secondary=fine_student,
        back_populates="fines"
    )
