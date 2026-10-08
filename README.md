# Zoom Clone - Video Conferencing Platform

A full-stack video conferencing application that closely replicates the core functionalities, design, and user experience of Zoom. Built as a Single Page Application (SPA) using Next.js, powered by a FastAPI Python backend, and uses LiveKit for real-time WebRTC audio/video infrastructure.

## Features

### Core Features
- **Landing Dashboard**: Clean Zoom-like UI with a navbar, quick action buttons (New Meeting, Join, Schedule), and sections for Upcoming and Recent meetings.
- **Instant Meeting Creation**: One-click instant meeting generation with unique IDs and shareable links.
- **Join Meeting**: Join active meetings via ID or invite link. Includes a pre-join screen to configure audio/video and display name.
- **Schedule Meetings**: Full scheduling modal allowing configuration of Title, Description, Date, Time, and Duration.
- **Meeting Management**: Edit or delete scheduled meetings directly from the dashboard.

### Bonus / Advanced Features
- **Hybrid Authentication System**: 
  - **Guest Mode (No Login Required)**: Users can instantly create, schedule, and join meetings as a default user without any friction.
  - **Registered Users**: Includes a fully functional JWT-based Login/Signup system for a personalized experience.
- **Host Controls**: Meeting hosts (identified by display name containing 'kunal', 'browser', or 'host') have elevated privileges to:
  - Mute specific participants or Mute All
  - Disable participants' cameras
  - Remove/Kick participants from the meeting
- **Responsive Design**: The UI is built with Tailwind CSS to be fully responsive across mobile, tablet, and desktop devices.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **WebRTC**: LiveKit Components React

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Authentication**: PyJWT, Passlib (bcrypt)
- **Validation**: Pydantic

## Project Structure

- `/frontend`: Next.js application containing the UI, routing, state, and API integration.
- `/backend`: FastAPI application containing the RESTful API, database models, and authentication logic.

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- A LiveKit Cloud account (for WebRTC keys)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=sqlite:///./zoom_clone.db
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   JWT_SECRET_KEY=your_super_secret_key
   ```
5. Seed the database (Optional but recommended):
   ```bash
   python seed.py
   ```
6. Start the FastAPI server:
   ```bash
   fastapi dev app/main.py
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-url
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Assumptions Made
- **LiveKit for WebRTC**: To ensure high reliability, low latency, and a production-ready video conferencing experience, LiveKit was chosen over raw WebRTC/Socket.io. This handles NAT traversal, signaling, and SFU logic natively.
- **Host Identification**: As per requirements, meeting host privileges are granted based on substring matching in the display name (e.g., 'kunal', 'browser', 'host') rather than strict database foreign key relationships in the live room, allowing guests to easily test host controls.
- **Email Verification Mocking**: The signup flow simulates an email verification delay visually, but does not rely on a real SMTP server to ensure the assignment can be tested entirely locally.
