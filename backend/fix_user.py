import sqlite3
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
conn = sqlite3.connect('zoom_clone.db')

try:
    conn.execute('''
    INSERT INTO users (name, email, hashed_password, created_at) 
    VALUES (?, ?, ?, ?)
    ''', ('Kunal Gupta', 'kunalgupta28k@gmail.com', pwd_context.hash('password123'), datetime.utcnow()))
    conn.commit()
    print("User successfully inserted with password123.")
except Exception as e:
    print(f"Error inserting user: {e}")
    conn.execute('''
    UPDATE users SET hashed_password = ? WHERE email = ?
    ''', (pwd_context.hash('password123'), 'kunalgupta28k@gmail.com'))
    conn.commit()
    print("User successfully updated with password123.")

conn.close()
