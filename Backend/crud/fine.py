from sqlalchemy.orm import Session
from models.fine import Fine
from schemas.fine import FineCreate, FineUpdate

# Create
def create_fine(db: Session, fine_data: FineCreate) -> Fine:
    fine = Fine(**fine_data.dict())
    db.add(fine)
    db.commit()
    db.refresh(fine)
    return fine

# Read
def get_all_fines(db: Session, skip: int = 0, limit: int = 100) -> list[Fine]:
    return db.query(Fine).offset(skip).limit(limit).all()

def get_fine(db: Session, fine_id: int) -> Fine | None:
    return db.query(Fine).filter(Fine.fine_id == fine_id).first()

# Update
def update_fine(db: Session, fine_id: int, fine_data: FineUpdate) -> Fine | None:
    fine = db.query(Fine).filter(Fine.fine_id == fine_id).first()
    if not fine:
        return None
    for field, value in fine_data.dict(exclude_unset=True).items():
        setattr(fine, field, value)
    db.commit()
    db.refresh(fine)
    return fine

def mark_fine_as_paid(db: Session, fine_id: int) -> Fine | None:
    fine = db.query(Fine).filter(Fine.fine_id == fine_id).first()
    if not fine:
        return None
    fine.is_paid = True
    db.commit()
    db.refresh(fine)
    return fine

# Delete
def delete_fine(db: Session, fine_id: int) -> bool:
    fine = db.query(Fine).filter(Fine.fine_id == fine_id).first()
    if not fine:
        return False
    db.delete(fine)
    db.commit()
    return True