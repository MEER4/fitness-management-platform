from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class PlanBase(BaseModel):
    title: str
    price: float
    duration: int
    description: Optional[str] = None

class PlanCreate(PlanBase):
    pass

class PlanUpdate(PlanBase):
    title: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[int] = None

class PlanInDBBase(PlanBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Plan(PlanInDBBase):
    pass
