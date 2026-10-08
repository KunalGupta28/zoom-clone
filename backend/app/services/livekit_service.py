from livekit import api
import os
from fastapi import HTTPException
from ..config import settings

class LiveKitService:
    def __init__(self):
        self.api_key = settings.LIVEKIT_API_KEY
        self.api_secret = settings.LIVEKIT_API_SECRET
        self.server_url = settings.LIVEKIT_URL

        if not self.api_key or not self.api_secret:
            print("WARNING: LiveKit API credentials not set. Token generation will fail.")

    def create_token(self, room_name: str, participant_name: str, is_host: bool) -> str:
        if not self.api_key or not self.api_secret:
            raise HTTPException(status_code=500, detail="LiveKit credentials not configured on server")

        token = api.AccessToken(self.api_key, self.api_secret)
        token.with_identity(participant_name)
        token.with_name(participant_name)
        
        grant = api.VideoGrants(
            room_join=True,
            room=room_name,
            can_publish=True,
            can_subscribe=True,
            can_publish_data=True,
            room_admin=is_host, 
        )
        token.with_grants(grant)
        
        return token.to_jwt()
