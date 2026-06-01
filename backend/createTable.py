import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app.db")

def create_table():
    conn = None
    c = None
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.execute("PRAGMA foreign_keys = ON")
        c = conn.cursor()
        c.execute('''
                  CREATE TABLE IF NOT EXISTS users(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  email TEXT UNIQUE NOT NULL,
                  password TEXT NOT NULL,
                  role TEXT DEFAULT 'analyst' CHECK(role IN ('admin', 'analyst', 'viewer')),
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ''')
        print("Users table created successfully.")

        c.execute('''
                  CREATE TABLE IF NOT EXISTS transactions(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    amount REAL NOT NULL,
                    type TEXT NOT NULL, -- income / expense
                    category TEXT,
                    date DATE,
                    description TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                    FOREIGN KEY (user_id) REFERENCES users(id)
            );
        ''')

        c.execute("CREATE INDEX IF NOT EXISTS idx_user_id ON transactions(user_id)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_date ON transactions(date)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_category ON transactions(category)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_user_date ON transactions(user_id, date)")
        
        conn.commit()
        print("Transactions table created successfully.")
    except sqlite3.Error as e:
        print(f"Error creating table: {e}")
    finally:
        if conn:
            conn.close()

create_table()