from typing import List
from sqlalchemy.orm import Session
from app.models.progress import Progress
from app.schemas.progress import ProgressCreate

def create_progress(db: Session, obj_in: ProgressCreate, user_id: int):
    db_obj = Progress(
        user_id=user_id,
        weight=obj_in.weight,
        body_fat=obj_in.body_fat,
        notes=obj_in.notes
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_by_user(db: Session, user_id: int) -> List[Progress]:
    return db.query(Progress).filter(Progress.user_id == user_id).all()
