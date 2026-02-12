from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.schemas.plan import Plan

class SubscriptionBase(BaseModel):
    user_id: int
    plan_id: int
    status: str = "pending"

class SubscriptionCreate(BaseModel):
    plan_id: int

class SubscriptionUpdate(BaseModel):
    status: str

class SubscriptionInDBBase(SubscriptionBase):
    id: int
    start_date: datetime
    
    class Config:
        from_attributes = True

class Subscription(SubscriptionInDBBase):
    plan: Optional[Plan] = None
