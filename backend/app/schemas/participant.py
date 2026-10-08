from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ParticipantCreate(BaseModel):
    display_name: str = Field(..., min_length=1, max_length=50)

class ParticipantResponse(BaseModel):
    id: int
    meeting_id: int
    user_id: Optional[int]
    display_name: str
    role: str
    joined_at: datetime
    left_at: Optional[datetime]

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    token: str
    server_url: str
