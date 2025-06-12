from sqlalchemy import Column, Integer, Enum
from sqlalchemy.orm import relationship
from database.database import Base
from .enums import FineTypeEnum


class Fine(Base):
    __tablename__ = "fines"
    fine_id = Column(Integer, primary_key=True, autoincrement=True)
    fine_type = Column(Enum(FineTypeEnum), nullable=False)
    value = Column(Integer, nullable=False)

    fine_associations = relationship("FineStudent", back_populates="fine", cascade="all, delete-orphan")
