from sqlalchemy.orm import Session
from app.models.plan import Subscription
from typing import List, Optional

def create(db: Session, *, user_id: int, plan_id: int, status: str = "pending") -> Subscription:
    db_obj = Subscription(user_id=user_id, plan_id=plan_id, status=status)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_by_user(db: Session, user_id: int) -> List[Subscription]:
    return db.query(Subscription).filter(Subscription.user_id == user_id).all()

def get_by_status(db: Session, status: str) -> List[Subscription]:
    return db.query(Subscription).filter(Subscription.status == status).all()

def get(db: Session, id: int) -> Optional[Subscription]:
    return db.query(Subscription).filter(Subscription.id == id).first()

def update_status(db: Session, *, db_obj: Subscription, status: str) -> Subscription:
    db_obj.status = status
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
