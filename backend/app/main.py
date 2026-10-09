from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from .database import Base, engine
from .models.user import User
from .models.meeting import Meeting
from .models.participant import Participant
from .routers import meetings, health, auth
from .config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

# Auto-migrate: Add missing auth columns to users table if they don't exist
try:
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0"))
        except Exception:
            pass
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN verification_token VARCHAR"))
        except Exception:
            pass
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR"))
        except Exception:
            pass
except Exception as e:
    print("Migration failed:", e)

app = FastAPI(title="Zoom Clone API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(health.router)
app.include_router(meetings.router)
