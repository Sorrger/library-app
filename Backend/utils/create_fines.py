from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database.database import get_db
from models.loan import Loan
from models.fine import Fine

def create_fines_for_overdue_loans():
    db: Session = get_db()
    try:
        overdue_date = datetime.utcnow() - timedelta(days=20)
        overdue_loans = db.query(Loan).filter(
            Loan.return_date == None,
            Loan.loan_date < overdue_date
        ).all()

        for loan in overdue_loans:
            existing_fine = db.query(Fine).filter(Fine.loan_id == loan.loan_id).first()

            if not existing_fine:
                new_fine = Fine(
                    description="Overdue loan fine (20+ days)",
                    value=50, 
                    is_paid=False,
                    loan_id=loan.loan_id,
                    student_id=loan.student_id
                )
                db.add(new_fine)
                print(f"Created fine for loan_id {loan.loan_id} student_id {loan.student_id}")

        db.commit()
    except Exception as e:
        print(f"Error while creating fines: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_fines_for_overdue_loans()
