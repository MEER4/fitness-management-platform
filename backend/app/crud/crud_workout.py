from sqlalchemy.orm import Session
from app.models.workout import Workout
from app.schemas.workout import WorkoutCreate

def get_workouts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Workout).offset(skip).limit(limit).all()

def create_workout(db: Session, workout: WorkoutCreate):
    db_workout = Workout(
        title=workout.title,
        description=workout.description,
        level=workout.level
    )
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout
