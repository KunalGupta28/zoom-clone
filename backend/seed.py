import sqlite3
from datetime import datetime, timedelta
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_database():
    conn = sqlite3.connect('zoom_clone.db')
    cursor = conn.cursor()

    print("Starting database seed...")

    # 1. Seed Users
    hashed_pw = pwd_context.hash('password123')
    
    # Check if default user exists, if not insert
    cursor.execute("SELECT id FROM users WHERE email='default@example.com'")
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (id, name, email, hashed_password, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (1, 'Guest Default', 'default@example.com', hashed_pw, datetime.utcnow()))
        print("Inserted default user.")

    # Insert a test authenticated user
    cursor.execute("SELECT id FROM users WHERE email='kunalgupta28k@gmail.com'")
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (id, name, email, hashed_password, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (2, 'Kunal Gupta', 'kunalgupta28k@gmail.com', hashed_pw, datetime.utcnow()))
        print("Inserted Kunal test user.")

    # 2. Seed Meetings
    now = datetime.utcnow()
    
    meetings_data = [
        # Upcoming meetings
        ('Standup Meeting', 'Daily sync with the engineering team', now + timedelta(days=1, hours=2), 30, 'room-standup-123', 1),
        ('Project Alpha Kickoff', 'Initial planning for Q3 goals', now + timedelta(days=2, hours=5), 60, 'room-alpha-456', 2),
        ('Client Review', 'Reviewing the latest mockups', now + timedelta(minutes=30), 45, 'room-client-789', 1),
        
        # Recent/Past meetings
        ('Weekly Sync', 'Past weekly sync', now - timedelta(days=1), 45, 'room-sync-past', 1),
        ('Design Demo', 'UI/UX demo for the new features', now - timedelta(days=3), 60, 'room-demo-past', 2),
    ]

    for title, desc, start_time, duration, room_name, user_id in meetings_data:
        # Check if room already seeded
        cursor.execute("SELECT id FROM meetings WHERE room_name=?", (room_name,))
        if not cursor.fetchone():
            cursor.execute('''
                INSERT INTO meetings (title, description, start_time, duration, is_instant, room_name, created_at, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (title, desc, start_time, duration, False, room_name, now, user_id))
            print(f"Inserted meeting: {title}")

    conn.commit()
    conn.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
