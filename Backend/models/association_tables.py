from sqlalchemy import Table, Column, Integer, ForeignKey
from database.database import Base

book_author = Table(
    "book_author",
    Base.metadata,
    Column("book_id", Integer, ForeignKey("books.book_id"), primary_key=True),
    Column("author_id", Integer, ForeignKey("authors.author_id"), primary_key=True)
)

book_genre = Table(
    "book_genre",
    Base.metadata,
    Column("book_id", Integer, ForeignKey("books.book_id"), primary_key=True),
    Column("genre_id", Integer, ForeignKey("genres.genre_id"), primary_key=True)
)

fine_student = Table(
    "fine_student",
    Base.metadata,
    Column("fine_id", Integer, ForeignKey("fines.fine_id"), primary_key=True),
    Column("student_id", Integer, ForeignKey("students.student_id"), primary_key=True)

)
