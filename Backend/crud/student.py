from sqlalchemy.orm import Session
from models import Student
from schemas.student import StudentCreate

# == Create ==
def create_student(db: Session, student_data: StudentCreate):
    db_student = Student(
        name=student_data.name,
        surname=student_data.surname,
        phone_number=student_data.phone_number
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# == Read ==
def get_all_students(db: Session):
    return db.query(Student).all()

def get_student_by_id(db: Session, student_id: int):
    return db.query(Student).filter(Student.student_id == student_id).first()

# == Update ==

def increase_books_limit_by_id(db:Session, student_id: int):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        return None
    student.books_limit += 1
    db.commit()
    db.refresh(student)
    return student

def decrease_books_limit_by_id(db:Session, student_id: int):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        return None
    student.books_limit -= 1
    db.commit()
    db.refresh(student)
    return student


# == Delete ==