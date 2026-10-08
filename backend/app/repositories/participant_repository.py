from sqlalchemy.orm import Session
from ..models.participant import Participant
from typing import Optional

class ParticipantRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, participant: Participant) -> Participant:
        self.db.add(participant)
        self.db.commit()
        self.db.refresh(participant)
        return participant
    
    def get_participant_by_meeting_and_name(self, meeting_id: int, display_name: str) -> Optional[Participant]:
        return self.db.query(Participant).filter(
            Participant.meeting_id == meeting_id,
            Participant.display_name == display_name,
            Participant.left_at.is_(None)
        ).first()
