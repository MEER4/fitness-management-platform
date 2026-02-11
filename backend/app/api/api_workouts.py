from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_workout
from app.schemas.workout import Workout, WorkoutCreate
from app.models.user import User, UserRole

router = APIRouter()

@router.get("/", response_model=List[Workout])
def read_workouts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    workouts = crud_workout.get_workouts(db, skip=skip, limit=limit)
    return workouts

@router.post("/", response_model=Workout)
def create_workout(
    *,
    db: Session = Depends(deps.get_db),
    workout_in: WorkoutCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    if current_user.role != UserRole.COACH:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only coaches can create workouts.",
        )
    workout = crud_workout.create_workout(db, workout=workout_in)
    return workout
