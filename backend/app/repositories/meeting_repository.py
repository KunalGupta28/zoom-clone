from sqlalchemy.orm import Session
from ..models.meeting import Meeting
from typing import List, Optional
from datetime import datetime, timezone

class MeetingRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_code(self, meeting_code: str) -> Optional[Meeting]:
        return self.db.query(Meeting).filter(Meeting.meeting_code == meeting_code).first()

    def get_upcoming(self, user_id: int, limit: int = 10) -> List[Meeting]:
        now_utc = datetime.now(timezone.utc)
        return self.db.query(Meeting).filter(
            Meeting.host_user_id == user_id,
            Meeting.status == "scheduled",
            Meeting.scheduled_at > now_utc
        ).order_by(Meeting.scheduled_at.asc()).limit(limit).all()

    def get_recent(self, user_id: int, limit: int = 10) -> List[Meeting]:
        return self.db.query(Meeting).filter(
            Meeting.host_user_id == user_id,
            Meeting.status == "ended"
        ).order_by(Meeting.ended_at.desc()).limit(limit).all()

    def create(self, meeting: Meeting) -> Meeting:
        self.db.add(meeting)
        self.db.commit()
        self.db.refresh(meeting)
        return meeting

    def delete(self, meeting: Meeting):
        self.db.delete(meeting)
        self.db.commit()

    def update(self, meeting: Meeting) -> Meeting:
        self.db.commit()
        self.db.refresh(meeting)
        return meeting
