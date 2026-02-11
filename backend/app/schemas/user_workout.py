from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class UserWorkoutBase(BaseModel):
    user_id: int
    workout_id: int

class UserWorkoutCreate(UserWorkoutBase):
    pass

class UserWorkoutInDBBase(UserWorkoutBase):
    id: int
    completed: bool
    assigned_at: datetime

    class Config:
        from_attributes = True

class UserWorkout(UserWorkoutInDBBase):
    pass
