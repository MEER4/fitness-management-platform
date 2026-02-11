from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Workout(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    level = Column(String)  # e.g., "beginner", "intermediate", "advanced"

    user_workouts = relationship("UserWorkout", back_populates="workout")

class UserWorkout(Base):
    __tablename__ = "user_workout" # Explicitly naming because CamelCase -> underscore might be tricky or just preference

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    workout_id = Column(Integer, ForeignKey("workout.id"))
    completed = Column(Boolean, default=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_workouts")
    workout = relationship("Workout", back_populates="user_workouts")
