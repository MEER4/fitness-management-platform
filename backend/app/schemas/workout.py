from typing import Optional
from pydantic import BaseModel

class WorkoutBase(BaseModel):
    title: str
    description: Optional[str] = None
    level: str  # e.g., "beginner", "intermediate", "advanced"

class WorkoutCreate(WorkoutBase):
    pass

class WorkoutUpdate(WorkoutBase):
    title: Optional[str] = None
    level: Optional[str] = None

class WorkoutInDBBase(WorkoutBase):
    id: int

    class Config:
        from_attributes = True

class Workout(WorkoutInDBBase):
    pass
