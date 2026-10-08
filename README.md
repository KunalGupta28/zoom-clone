# Zoom Clone

## 1. Overview
A full-stack, real-time video conferencing platform built as a clone of Zoom. This project implements a high-fidelity Zoom-like UI, real-time audio/video using LiveKit, and a robust backend for meeting scheduling and lifecycle management.

## 2. Features
- **Landing Dashboard**: View upcoming and recent meetings, start instant meetings, or join via ID.
- **Instant & Scheduled Meetings**: Create meetings on the fly or schedule them for the future.
- **Real-Time Video/Audio**: High-quality WebRTC powered by LiveKit.
- **Screen Sharing & Chat**: Built-in screen sharing and real-time in-room text chat.
- **Zoom-like UI**: Dark-themed meeting rooms, responsive video grids, and familiar control bars.

## 3. Architecture
- **Frontend**: Next.js (App Router), Tailwind CSS v4, Zustand (UI State), LiveKit React Components.
- **Backend**: Python FastAPI, SQLAlchemy, SQLite.
- **Real-time Engine**: LiveKit Cloud SFU.

## 4. Local Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- LiveKit Cloud account (for API credentials)

### Backend Setup
1. `cd backend`
2. `python -m venv venv`
3. Activate venv (`source venv/bin/activate` or `.\venv\Scripts\Activate.ps1`)
4. `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and fill in your `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, and `LIVEKIT_URL`.
6. Run the seed script: `python seed.py`
7. Start server: `fastapi dev app/main.py` (runs on http://localhost:8000)

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
4. Run dev server: `npm run dev` (runs on http://localhost:3000)

## 5. Assumptions & Limitations
- **Authentication**: Authentication is mocked using a default `user_id = 1` ("Kunal") as permitted by the assignment constraints.
- **Chat**: Chat uses LiveKit Data Channels and is intentionally ephemeral (not persisted to the database).
- **Timezones**: SQLite does not support native timezones natively, so timestamps are strictly handled as UTC by the FastAPI application.
