import sqlite3
import os

# Update .env
env_path = r"C:\Users\Dell\Desktop\Video Conferencing Platform\backend\.env"
with open(env_path, "a") as f:
    f.write("\nSMTP_EMAIL=neelamguptaneelamgupta8@gmail.com\n")
    f.write("SMTP_PASSWORD=tcvnzpaciirnhade\n")
    f.write("SMTP_HOST=smtp.gmail.com\n")
    f.write("SMTP_PORT=587\n")

# Update DB
db_path = r"C:\Users\Dell\Desktop\Video Conferencing Platform\backend\zoom_clone.db"
conn = sqlite3.connect(db_path)
cur = conn.cursor()

try:
    cur.execute("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0")
except sqlite3.OperationalError as e:
    print(f"Error (might already exist): {e}")

try:
    cur.execute("ALTER TABLE users ADD COLUMN verification_token VARCHAR")
except sqlite3.OperationalError as e:
    print(f"Error (might already exist): {e}")

try:
    cur.execute("ALTER TABLE users ADD COLUMN reset_token VARCHAR")
except sqlite3.OperationalError as e:
    print(f"Error (might already exist): {e}")
    
conn.commit()
conn.close()
print("Migration and .env update complete.")
