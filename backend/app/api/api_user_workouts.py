from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_user_workout
from app.schemas.user_workout import UserWorkout, UserWorkoutCreate
from app.models.user import User, UserRole

router = APIRouter()

@router.post("/", response_model=UserWorkout)
def assign_workout(
    *,
    db: Session = Depends(deps.get_db),
    user_workout_in: UserWorkoutCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Assign a workout to a user. Only Coaches can do this.
    """
    if current_user.role != UserRole.COACH:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only coaches can assign workouts.",
        )
    user_workout = crud_user_workout.create_user_workout(db, obj_in=user_workout_in)
    return user_workout

@router.get("/me", response_model=List[UserWorkout])
def read_my_workouts(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user's assigned workouts.
    """
    user_workouts = crud_user_workout.get_by_user(db, user_id=current_user.id)
    return user_workouts
