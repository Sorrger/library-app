from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database.database import Base

class publishingHouse(Base):
    __tablename__ = "publishing_houses"

    publishingh_Houses_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    headquarters = Column(String(255), nullable=False)

    editions = relationship("Edition", back_populates="publishingHouses")
