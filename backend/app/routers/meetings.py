from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.meeting import MeetingCreate, MeetingResponse
from ..schemas.participant import ParticipantCreate, ParticipantResponse, TokenResponse
from ..services.meeting_service import MeetingService
from ..services.livekit_service import LiveKitService
from typing import List

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

DEFAULT_USER_ID = 1

@router.post("", response_model=MeetingResponse)
def create_meeting(meeting: MeetingCreate, db: Session = Depends(get_db)):
    service = MeetingService(db)
    return service.create_meeting(meeting, host_user_id=DEFAULT_USER_ID)

@router.get("/upcoming", response_model=List[MeetingResponse])
def get_upcoming_meetings(db: Session = Depends(get_db)):
    service = MeetingService(db)
    return service.get_upcoming_meetings()

@router.get("/recent", response_model=List[MeetingResponse])
def get_recent_meetings(db: Session = Depends(get_db)):
    service = MeetingService(db)
    return service.get_recent_meetings()

@router.get("/{meeting_code}", response_model=MeetingResponse)
def get_meeting(meeting_code: str, db: Session = Depends(get_db)):
    service = MeetingService(db)
    return service.get_meeting(meeting_code)

@router.post("/{meeting_code}/token", response_model=TokenResponse)
def generate_token(meeting_code: str, participant: ParticipantCreate, db: Session = Depends(get_db)):
    service = MeetingService(db)
    lk_service = LiveKitService()
    
    meeting = service.get_meeting(meeting_code)
    
    # Mocking host authorization based on the name for this assignment
    is_host = participant.display_name.lower() == "kunal"
    
    service.join_meeting(meeting_code, participant, user_id=DEFAULT_USER_ID if is_host else None)
    
    token = lk_service.create_token(
        room_name=meeting_code,
        participant_name=participant.display_name,
        is_host=is_host
    )
    
    return TokenResponse(token=token, server_url=lk_service.server_url)
