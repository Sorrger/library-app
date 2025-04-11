from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database.database import Base

class Edition(Base):
    __tablename__ = "editions"

    edition_id = Column(Integer, primary_key=True, auto_increment=True)
    status = Column(String(255), nullable=False)
    book_format = Column(String(255), nullable=False)

    publishingHouses = relationship("PublishingHouse", back_populates="editions")
    book = relationship("Book", back_populates="editions")