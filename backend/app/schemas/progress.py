from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ProgressBase(BaseModel):
    weight: float
    body_fat: float
    notes: Optional[str] = None

class ProgressCreate(ProgressBase):
    pass

class ProgressInDBBase(ProgressBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True

class Progress(ProgressInDBBase):
    pass
