from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base

class Edition(Base):
    __tablename__ = "editions"

    edition_id = Column(Integer, primary_key=True, auto_increment=True)
    book_id = Column(Integer, ForeignKey("books.book_id"), nullable=False)
    publishinghHouse_id = Column(Integer, ForeignKey("publishing_houses.publishing_house_id"), nullable=False)
    status = Column(String(255), nullable=False)
    book_format = Column(String(255), nullable=False)

    publishingHouses = relationship("PublishingHouse", back_populates="editions")