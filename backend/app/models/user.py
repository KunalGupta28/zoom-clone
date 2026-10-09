from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True) # Nullable for guest accounts
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Auth fields
    is_verified = Column(Integer, default=0) # SQLite boolean
    verification_token = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
