from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./zoom_clone.db"
    LIVEKIT_API_KEY: str = ""
    LIVEKIT_API_SECRET: str = ""
    LIVEKIT_URL: str = ""
    FRONTEND_ORIGIN: str = "http://localhost:3000"
    SMTP_EMAIL: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587

    class Config:
        env_file = ".env"

settings = Settings()
