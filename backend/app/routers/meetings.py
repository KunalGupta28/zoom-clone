from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.meeting import MeetingCreate, MeetingResponse, MeetingUpdate
from ..schemas.participant import ParticipantCreate, ParticipantResponse, TokenResponse
from ..services.meeting_service import MeetingService
from ..services.livekit_service import LiveKitService
from ..auth import get_current_user
from ..models.user import User
from typing import List

router = APIRouter(prefix="/api/meetings", tags=["meetings"])

DEFAULT_USER_ID = 1

@router.post("", response_model=MeetingResponse)
def create_meeting(meeting: MeetingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = MeetingService(db)
    host_id = current_user.id if current_user else DEFAULT_USER_ID
    return service.create_meeting(meeting, host_user_id=host_id)

@router.get("/upcoming", response_model=List[MeetingResponse])
def get_upcoming_meetings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = MeetingService(db)
    host_id = current_user.id if current_user else DEFAULT_USER_ID
    return service.get_upcoming_meetings(host_id)

@router.get("/recent", response_model=List[MeetingResponse])
def get_recent_meetings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = MeetingService(db)
    host_id = current_user.id if current_user else DEFAULT_USER_ID
    return service.get_recent_meetings(host_id)

@router.get("/{meeting_code}", response_model=MeetingResponse)
def get_meeting(meeting_code: str, db: Session = Depends(get_db)):
    service = MeetingService(db)
    return service.get_meeting(meeting_code)

@router.post("/{meeting_code}/token", response_model=TokenResponse)
def generate_token(
    meeting_code: str, 
    participant: ParticipantCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = MeetingService(db)
    lk_service = LiveKitService()
    
    meeting = service.get_meeting(meeting_code)
    
    # Check if the current logged-in user is the host of this meeting
    is_host = False
    user_id = None
    if current_user:
        user_id = current_user.id
        if current_user.id == meeting.host_user_id:
            is_host = True
    
    service.join_meeting(meeting_code, participant, user_id=user_id)
    
    token = lk_service.create_token(
        room_name=meeting_code,
        participant_name=participant.display_name,
        is_host=is_host
    )
    
    return TokenResponse(token=token, server_url=lk_service.server_url)

@router.put("/{meeting_code}", response_model=MeetingResponse)
def update_meeting(meeting_code: str, update_data: MeetingUpdate, db: Session = Depends(get_db)):
    service = MeetingService(db)
    return service.update_meeting(meeting_code, title=update_data.title, description=update_data.description)

@router.delete("/{meeting_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(meeting_code: str, db: Session = Depends(get_db)):
    service = MeetingService(db)
    service.delete_meeting(meeting_code)
    return None
