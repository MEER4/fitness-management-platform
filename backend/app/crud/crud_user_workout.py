from typing import List
from sqlalchemy.orm import Session
from app.models.workout import UserWorkout
from app.schemas.user_workout import UserWorkoutCreate

def create_user_workout(db: Session, obj_in: UserWorkoutCreate):
    db_obj = UserWorkout(
        user_id=obj_in.user_id,
        workout_id=obj_in.workout_id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_by_user(db: Session, user_id: int) -> List[UserWorkout]:
    return db.query(UserWorkout).filter(UserWorkout.user_id == user_id).all()
