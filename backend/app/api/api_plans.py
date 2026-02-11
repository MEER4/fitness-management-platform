from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_plan
from app.schemas.plan import Plan, PlanCreate
from app.models.user import User, UserRole

router = APIRouter()

@router.get("/", response_model=List[Plan])
def read_plans(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    plans = crud_plan.get_plans(db, skip=skip, limit=limit)
    return plans

@router.post("/", response_model=Plan)
def create_plan(
    *,
    db: Session = Depends(deps.get_db),
    plan_in: PlanCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    if current_user.role != UserRole.COACH:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only coaches can create plans.",
        )
    plan = crud_plan.create_plan(db, plan=plan_in)
    return plan
