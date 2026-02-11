from sqlalchemy.orm import Session
from app.models.plan import Plan
from app.schemas.plan import PlanCreate

def get_plans(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Plan).offset(skip).limit(limit).all()

def create_plan(db: Session, plan: PlanCreate):
    db_plan = Plan(
        title=plan.title,
        price=plan.price,
        duration=plan.duration,
        description=plan.description
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan
