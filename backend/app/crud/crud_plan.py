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

def get_plan(db: Session, plan_id: int):
    return db.query(Plan).filter(Plan.id == plan_id).first()

def update_plan(db: Session, db_plan: Plan, plan_in: PlanCreate): # Using PlanCreate or Update? Let's check imports.
    # ideally should import PlanUpdate
    update_data = plan_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_plan, field, value)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

def delete_plan(db: Session, plan_id: int):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if plan:
        db.delete(plan)
        db.commit()
    return plan
