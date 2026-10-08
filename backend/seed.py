import os
from datetime import datetime, timedelta, timezone
from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.meeting import Meeting
import random
import string

def generate_meeting_code() -> str:
    return "".join(random.choices(string.digits, k=11))

def seed_data():
    db = SessionLocal()
    
    # Create tables if not exists
    Base.metadata.create_all(bind=engine)
    
    # Idempotent check: if user exists, don't re-seed
    user = db.query(User).filter(User.email == "kunal@example.com").first()
    if user:
        print("Data already seeded. Skipping.")
        db.close()
        return

    print("Seeding initial data...")
    now_utc = datetime.now(timezone.utc)
    
    # Create default host user
    default_user = User(
        name="Kunal",
        email="kunal@example.com",
        created_at=now_utc
    )
    db.add(default_user)
    db.commit()
    db.refresh(default_user)

    # Create Upcoming Meetings
    for i in range(1, 4):
        meeting = Meeting(
            meeting_code=generate_meeting_code(),
            title=f"Upcoming Sync {i}",
            description="Discussion on project milestones.",
            host_user_id=default_user.id,
            scheduled_at=now_utc + timedelta(days=i, hours=2),
            duration_minutes=45,
            status="scheduled",
            created_at=now_utc
        )
        db.add(meeting)

    # Create Recent Meetings
    for i in range(1, 4):
        meeting = Meeting(
            meeting_code=generate_meeting_code(),
            title=f"Past Review {i}",
            host_user_id=default_user.id,
            scheduled_at=now_utc - timedelta(days=i, hours=2),
            duration_minutes=60,
            status="ended",
            created_at=now_utc - timedelta(days=i, hours=2),
            started_at=now_utc - timedelta(days=i, hours=2),
            ended_at=now_utc - timedelta(days=i, hours=1)
        )
        db.add(meeting)
    
    db.commit()
    print("Seed complete!")
    db.close()

if __name__ == "__main__":
    seed_data()
