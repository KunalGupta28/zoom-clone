import random
import string
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from ..models.meeting import Meeting
from ..models.participant import Participant
from ..schemas.meeting import MeetingCreate
from ..schemas.participant import ParticipantCreate
from ..repositories.meeting_repository import MeetingRepository
from ..repositories.participant_repository import ParticipantRepository
from fastapi import HTTPException

def generate_meeting_code() -> str:
    # Generates an 11-digit string code
    return "".join(random.choices(string.digits, k=11))

class MeetingService:
    def __init__(self, db: Session):
        self.db = db
        self.meeting_repo = MeetingRepository(db)
        self.participant_repo = ParticipantRepository(db)

    def create_meeting(self, meeting_data: MeetingCreate, host_user_id: int) -> Meeting:
        meeting_code = generate_meeting_code()
        
        status = "scheduled" if meeting_data.type == "scheduled" else "active"
        
        meeting = Meeting(
            meeting_code=meeting_code,
            title=meeting_data.title,
            description=meeting_data.description,
            host_user_id=host_user_id,
            scheduled_at=meeting_data.scheduled_at,
            duration_minutes=meeting_data.duration_minutes,
            status=status
        )
        return self.meeting_repo.create(meeting)

    def get_meeting(self, meeting_code: str) -> Meeting:
        meeting = self.meeting_repo.get_by_code(meeting_code)
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")
        return meeting

    def get_upcoming_meetings(self, user_id: int):
        return self.meeting_repo.get_upcoming(user_id)

    def get_recent_meetings(self, user_id: int):
        return self.meeting_repo.get_recent(user_id)

    def join_meeting(self, meeting_code: str, participant_data: ParticipantCreate, user_id: int = None) -> Participant:
        meeting = self.get_meeting(meeting_code)
        
        if meeting.status == "cancelled":
            raise HTTPException(status_code=400, detail="Meeting is cancelled")

        role = "host" if user_id and user_id == meeting.host_user_id else "participant"

        existing = self.participant_repo.get_participant_by_meeting_and_name(meeting.id, participant_data.display_name)
        if existing:
            return existing

        participant = Participant(
            meeting_id=meeting.id,
            user_id=user_id,
            display_name=participant_data.display_name,
            role=role
        )
        return self.participant_repo.create(participant)

    def delete_meeting(self, meeting_code: str):
        meeting = self.get_meeting(meeting_code)
        
        # Manually delete all participants first to avoid foreign key constraint errors
        participants = self.db.query(Participant).filter(Participant.meeting_id == meeting.id).all()
        for p in participants:
            self.db.delete(p)
            
        self.meeting_repo.delete(meeting)

    def update_meeting(self, meeting_code: str, title: str = None, description: str = None) -> Meeting:
        meeting = self.get_meeting(meeting_code)
        if title is not None:
            meeting.title = title
        if description is not None:
            meeting.description = description
        return self.meeting_repo.update(meeting)
