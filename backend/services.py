import sqlite3
import os
from flask_jwt_extended import get_jwt

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "app.db")


# ============================================== TRANSACTION SERVICE ===================================#
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def create(data, user_id):
    try:
        amount = float(data.get("amount"))
    except (TypeError, ValueError):
        raise ValueError("Amount must be a valid number")
        
    t_type = data.get("type", "").strip().lower()
    category = data.get("category", "").strip().lower()
    date = data.get("date", "").strip()
    description = data.get("description", "").strip()

    if amount is None or not t_type or not date or not category or not description:
        raise ValueError("All fields are required")
    
    if amount <= 0:
        raise ValueError("Amount must be positive")
    
    if t_type not in ["income", "expense"]:
        raise ValueError("Invalid transaction type")

    conn = get_conn()
    try:
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO transactions (user_id, amount, type, category, date, description)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, amount, t_type, category, date, description))

        conn.commit()

        return {"message": "Transaction added"}
    finally:
        conn.close()

def get_all(user_id, is_admin):
    conn = get_conn()
    try:
        cursor = conn.cursor()

        if is_admin:
            cursor.execute("SELECT * FROM transactions ORDER BY date DESC")
        else:
            cursor.execute("SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC", (user_id,))

        rows = cursor.fetchall()

        return [format_transaction(row) for row in rows]
    finally:
        conn.close()

def get_insights(user_id, is_admin=False):
    conn = get_conn()
    try:
        cursor = conn.cursor()

            # Total income
        if is_admin:
            cursor.execute("""
                SELECT COALESCE(SUM(amount), 0)
                FROM transactions
                WHERE type = 'income'
            """)
        else:
            cursor.execute("""
                SELECT COALESCE(SUM(amount), 0)
                FROM transactions
                WHERE user_id = ? AND type = 'income'
            """, (user_id,))
        total_income = cursor.fetchone()[0]

            # Total expense
        if is_admin:
            cursor.execute("""
                SELECT COALESCE(SUM(amount), 0)
                FROM transactions
                WHERE type = 'expense'
            """)
        else:
            cursor.execute("""
                SELECT COALESCE(SUM(amount), 0)
                FROM transactions
                WHERE user_id = ? AND type = 'expense'
            """, (user_id,))
        total_expense = cursor.fetchone()[0]

            # Net savings
        net_savings = total_income - total_expense

            # Spending ratio
        spending_ratio = (total_expense / total_income * 100) if total_income > 0 else 0

            # Category-wise expense
        if is_admin:
            cursor.execute("""
                SELECT category, SUM(amount)
                FROM transactions
                WHERE type = 'expense'
                GROUP BY category
                ORDER BY SUM(amount) DESC
            """)
        else:
            cursor.execute("""
                SELECT category, SUM(amount)
                FROM transactions
                WHERE user_id = ? AND type = 'expense'
                GROUP BY category
                ORDER BY SUM(amount) DESC
            """, (user_id,))
        category_expense = cursor.fetchall()

            # Top category
        top_category = "No category"
        if category_expense:
            top_category = {
                "category": category_expense[0][0],
                "amount": category_expense[0][1]
            }

            # Monthly trend
        if is_admin:
            cursor.execute("""
                SELECT strftime('%Y-%m', date) as month,
                    SUM(CASE WHEN type='income' THEN amount ELSE 0 END),
                    SUM(CASE WHEN type='expense' THEN amount ELSE 0 END)
                FROM transactions
                GROUP BY month
                ORDER BY month
            """)
        else:
            cursor.execute("""
                SELECT strftime('%Y-%m', date) as month,
                    SUM(CASE WHEN type='income' THEN amount ELSE 0 END),
                    SUM(CASE WHEN type='expense' THEN amount ELSE 0 END)
                FROM transactions
                WHERE user_id = ?
                GROUP BY month
                ORDER BY month
            """, (user_id,))
        monthly = cursor.fetchall()

            # Spending Alert
        if total_income == 0:
            alert = {
                "status": "no_income",
                "message": "No income recorded."
            }
        elif total_expense > total_income:
            alert = {
                "status": "overspending",
                "message": "You are spending more than your income!"
            }
        elif total_expense > 0.8 * total_income:
            alert = {
                "status": "warning",
                "message": "Expenses are above 80% of income."
            }
        else:
            alert = {
                "status": "healthy",
                "message": "Spending is under control."
            }

        return {
            "summary": {
                "total_income": total_income,
                "total_expense": total_expense,
                "net_savings": net_savings,
                "spending_ratio_percent": round(spending_ratio, 2)
            },
            "spending_alert": alert,
            "top_expense_category": top_category,
            "category_breakdown": [
                {"category": row[0], "amount": row[1]} for row in category_expense
            ],
            "monthly_trend": [
                {"month": row[0], "income": row[1], "expense": row[2]} for row in monthly
            ]
        }
    finally:
        conn.close()

def filter_transactions(
    user_id,
    is_admin,
    category=None,
    start_date=None,
    end_date=None,
    page=1,
    limit=10
):
    conn = get_conn()

    try:
        cursor = conn.cursor()

        # Base query
        query = "SELECT * FROM transactions"
        conditions = []
        params = []

        # Non-admin users can only see their transactions
        if not is_admin:
            conditions.append("user_id = ?")
            params.append(user_id)

        # Category filter
        if category:
            conditions.append("LOWER(category) = ?")
            params.append(category.lower())

        # Start date filter
        if start_date:
            conditions.append("date >= ?")
            params.append(start_date)

        # End date filter
        if end_date:
            conditions.append("date <= ?")
            params.append(end_date)

        # Add WHERE clause if any filters exist
        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        # Total records count
        count_query = query.replace(
            "SELECT *",
            "SELECT COUNT(*)"
        )

        cursor.execute(count_query, params)
        total = cursor.fetchone()[0]

        # Pagination
        offset = (page - 1) * limit

        query += """
            ORDER BY date DESC
            LIMIT ? OFFSET ?
        """

        final_params = params + [limit, offset]

        cursor.execute(query, final_params)

        rows = cursor.fetchall()

        return {
            "transactions": [
                format_transaction(row)
                for row in rows
            ],
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": (total + limit - 1) // limit
            }
        }

    finally:
        conn.close()


def get_categories(user_id, is_admin):
    conn = get_conn()

    try:
        cursor = conn.cursor()

        if is_admin:
            cursor.execute("""
                SELECT DISTINCT category
                FROM transactions
                ORDER BY category
            """)
        else:
            cursor.execute("""
                SELECT DISTINCT category
                FROM transactions
                WHERE user_id = ?
                ORDER BY category
            """, (user_id,))

        rows = cursor.fetchall()

        return [row[0] for row in rows]

    finally:
        conn.close()


def update(transaction_id, user_id, data, is_admin):
    conn = get_conn()
    try:
        cursor = conn.cursor()

            # fetch
        if is_admin:
            cursor.execute("SELECT * FROM transactions WHERE id = ?", (transaction_id,))
        else:
            cursor.execute("SELECT * FROM transactions WHERE id = ? AND user_id = ?", (transaction_id, user_id))

        existing = cursor.fetchone()
        if not existing:
            raise ValueError("Transaction not found")

        try:
            amount = float(
                data.get("amount", existing[2])
            )
        except (TypeError, ValueError):
            raise ValueError("Amount must be a valid number")
            
        t_type = data.get("type")
        if t_type:
            t_type = t_type.strip().lower()
        else:
            t_type = existing[3]

        category = data.get("category")
        if category:
            category = category.strip().lower()
        else:
            category = existing[4]

        date = data.get("date")
        if date:
            date = date.strip()
        else:
            date = existing[5]

        description = data.get("description")
        if description:
            description = description.strip()
        else:
            description = existing[6]

        if amount is None or amount <= 0:
            raise ValueError("Amount must be positive")

        if t_type and t_type not in ["income", "expense"]:
            raise ValueError("Invalid transaction type")
        
        cursor.execute("""
            UPDATE transactions
            SET amount=?, type=?, category=?, date=?, description=?
            WHERE id=?
        """, (amount, t_type, category, date, description, transaction_id))

        conn.commit()

        return {"message": "Transaction updated"}
    finally:
        conn.close()

def delete(transaction_id, user_id, is_admin):
    conn = get_conn()
    try:
        cursor = conn.cursor()
        if is_admin:
            cursor.execute("DELETE FROM transactions WHERE id=?", (transaction_id,))
        else:
            cursor.execute("DELETE FROM transactions WHERE id=? AND user_id=?", (transaction_id, user_id))

        if cursor.rowcount == 0:
            raise ValueError("Transaction not found")

        conn.commit()

        return {"message": "Transaction deleted"}
    finally:
        conn.close()    

def format_transaction(row):
    return {
        "id": row[0],
        "user_id": row[1],
        "amount": row[2],
        "type": row[3],
        "category": row[4],
        "date": row[5],
        "description": row[6],
        "created_at": row[7]
    }


# ============================================ USER SERVICE ================================================#

def get_all_users():
    conn = get_conn()
    try:
        cursor = conn.cursor()

        cursor.execute("SELECT id, name, email, role, created_at FROM users")
        rows = cursor.fetchall()

        users = []

        for row in rows:

            user_id = row[0]

            #calculate income
            cursor.execute(
                """
                SELECT COALESCE(SUM(amount), 0)
                FROM transactions
                WHERE user_id = ?
                AND type = 'income'
                """,
                (user_id,)
            )

            total_income = cursor.fetchone()[0]

            cursor.execute(
                """
                SELECT COALESCE(SUM(amount),0)
                FROM transactions
                WHERE user_id = ?
                AND type='expense'
                """,
                (user_id,)
            )

            total_expense = cursor.fetchone()[0]

            #spending status
            if total_income == 0:

                status = "no_income"


            elif total_expense > total_income:

                status = "overspending"


            elif (
                total_expense /
                total_income
            ) >= 0.7:

                status = "warning"


            else:

                status = "healthy"

            users.append({

                "id": row[0],

                "name": row[1],

                "email": row[2],

                "role": row[3],


                "total_income": total_income,

                "total_expense": total_expense,

                "status": status

            })

        return users


    finally:
        conn.close()

def get_paginated_users(page=1, limit=5):

    if page < 1 or limit < 1:
        raise ValueError(
            "Invalid pagination values"
        )


    # get all users with income/expense/status
    all_users = get_all_users()


    total = len(all_users)


    start = (page - 1) * limit

    end = start + limit


    paginated_users = all_users[
        start:end
    ]


    return {

        "users": paginated_users,


        "pagination": {

            "page": page,

            "limit": limit,

            "total": total,

            "total_pages":
                (total + limit - 1) // limit

        }

    }

def update_user(user_id, data):
    conn = get_conn()
    try:
        cursor = conn.cursor()

        cursor.execute("SELECT name, email, role FROM users WHERE id=?", (user_id,))
        existing = cursor.fetchone()

        if not existing:
            raise ValueError("User not found")

        name = data.get("name")
        if name is None:
            name = existing[0]
        else:
            name = name.strip()
            if not name:
                raise ValueError("Name cannot be empty")

        email = data.get("email")
        if email is None:
            email = existing[1]
        else:
            email = email.strip().lower()
            if not email:
                raise ValueError("Email cannot be empty")

        role = data.get("role")
        if role is None:
            role = existing[2]
        else:
            role = role.strip().lower()

        allowed_roles = {"admin", "analyst"}
        if role not in allowed_roles:
            raise ValueError("Invalid role")

        cursor.execute("""
            UPDATE users SET name=?, email=?, role=? WHERE id=?
        """, (name, email, role, user_id))

        conn.commit()

        return {"message": "User updated"}
    finally:
        conn.close()

def delete_user(user_id):
    conn = get_conn()
    try:
        cursor = conn.cursor()

        cursor.execute("DELETE FROM users WHERE id=?", (user_id,))
        if cursor.rowcount == 0:
            raise ValueError("User not found")

        conn.commit()

        return {"message": "User deleted"}
    finally:
        conn.close()


# ====================================== ROLE ============================================#
def is_admin():
    return get_jwt().get("role") == "admin"
