from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Progress(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    weight = Column(Float)
    body_fat = Column(Float)
    notes = Column(String)
    date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="progress")
