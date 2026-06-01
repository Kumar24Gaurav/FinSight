import sqlite3
import bcrypt
import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app.db")

def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
    return re.match(pattern, email) is not None

def register_user(data):
    name = data.get("name","").strip()
    email = data.get("email","").strip().lower()
    password = data.get("password","").strip()

    if not name or not email or not password:
        raise ValueError("All fields are required")
    
    if not is_valid_email(email):
        raise ValueError("Invalid email format")
    
    if len(password)<6:
        raise ValueError("Password must be at least 6 characters")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # check if user exists
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            raise ValueError("User already exists")
        
        # Hash Password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert new user into database
        cursor.execute("""
            INSERT INTO users (name, email, password)
                       VALUES (?,?,?)
        """,(name, email, hashed_password.decode('utf-8')))

        conn.commit()

        return {"message": "User registered successfully"}
    finally:
        conn.close()


def login_user(data):
    email = data.get("email","").strip().lower()
    password = data.get("password","").strip()

    if not email or not password:
        raise ValueError("Email and password required")
    
    if not is_valid_email(email):
        raise ValueError("Invalid email format")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, name, password, role FROM users WHERE email = ?",(email,))
        user = cursor.fetchone()

        if not user:
            raise ValueError("Invalid credentials")
        
        user_id, name, stored_password, role = user

        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
            raise ValueError("Invalid credentials")
        
        return{
            "id": user_id,
            "name": name,
            "role": role
        }
    finally:
        conn.close()

        