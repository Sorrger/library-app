from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database.database import Base
from models.enums import EditionStatus

class Edition(Base):
    __tablename__ = "editions"

    edition_id = Column(Integer, primary_key=True, autoincrement=True)
    status = Column(
        Enum(EditionStatus, name="editionstatus", values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )   
    book_format = Column(String(255), nullable=False)

    book_id = Column(Integer, ForeignKey("books.book_id", ondelete="CASCADE"), nullable=False)
    publishing_house_id = Column(Integer, ForeignKey("publishing_houses.publishing_house_id"))

    publishing_house = relationship("PublishingHouse", back_populates="editions")
    book = relationship("Book", back_populates="editions")
    loans = relationship("Loan", back_populates="edition",cascade="all, delete-orphan") 

    

    