from pydantic import BaseModel, Field, field_validator
from datetime import datetime, timezone
from typing import Optional

class MeetingCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    duration_minutes: int = Field(..., gt=0)
    type: str = Field(..., pattern="^(instant|scheduled)$")

    @field_validator("scheduled_at")
    def validate_scheduled_at(cls, v):
        if v:
            if v.tzinfo is None or v.utcoffset() is None:
                raise ValueError("Datetime must include timezone information")
            return v.astimezone(timezone.utc)
        return v

class MeetingResponse(BaseModel):
    id: int
    meeting_code: str
    title: str
    description: Optional[str]
    host_user_id: int
    scheduled_at: Optional[datetime]
    duration_minutes: int
    status: str
    created_at: datetime
    started_at: Optional[datetime]
    ended_at: Optional[datetime]
    
    class Config:
        from_attributes = True
