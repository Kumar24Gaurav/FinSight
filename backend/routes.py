from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import (
create_access_token,
jwt_required,
get_jwt_identity
)

import auth
from services import (
create,
# get_all,
get_insights,
filter_transactions,
update,
delete,
get_all_users,
get_paginated_users,
update_user,
delete_user,
is_admin,
get_categories
)

api = Blueprint("api", __name__)

@api.errorhandler(ValueError)
def handle_value_error(error):
    return jsonify({"error": str(error)}), 400

@api.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True)

    if not data:
        raise ValueError("JSON payload required")

    result = auth.register_user(data)

    return jsonify(result), 201

@api.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)

    if not data:
        raise ValueError("JSON payload required")

    user = auth.login_user(data)

    access_token = create_access_token(
        identity=str(user["id"]),
        additional_claims={
            "role": user["role"],
            "name": user["name"]
        }
    )

    return jsonify({
        "access_token": access_token,
        "user": user
    })
# ========================= TRANSACTIONS =========================

# @api.route("/transactions", methods=["GET"])
# @jwt_required()
# def list_transactions():
#     user_id = int(get_jwt_identity())

#     result = get_all(
#         user_id,
#         is_admin()
#     )

#     return jsonify(result)

@api.route("/transactions", methods=["POST"])
@jwt_required()
def add_transaction():

    data = request.get_json(silent=True)

    if not data:
        raise ValueError("JSON payload required")

    user_id = int(get_jwt_identity())

    result = create(
        data,
        user_id
    )

    return jsonify(result), 201

@api.route("/transactions/<int:transaction_id>", methods=["PUT"])
@jwt_required()
def edit_transaction(transaction_id):

    data = request.get_json(silent=True)

    if not data:
        raise ValueError("JSON payload required")

    user_id = int(get_jwt_identity())

    result = update(
        transaction_id,
        user_id,
        data,
        is_admin()
    )

    return jsonify(result)

@api.route("/transactions/<int:transaction_id>", methods=["DELETE"])
@jwt_required()
def remove_transaction(transaction_id):

    user_id = int(get_jwt_identity())

    result = delete(
        transaction_id,
        user_id,
        is_admin()
    )

    return jsonify(result)

@api.route("/transactions/insights", methods=["GET"])
@jwt_required()
def transaction_insights():

    user_id = int(get_jwt_identity())

    admin = (
        is_admin() 
    )

    result = get_insights(
        user_id,
        admin
    )

    return jsonify(result)

@api.route("/transactions/filter", methods=["GET"])
@jwt_required()
def filter_transactions_route():

    user_id = int(get_jwt_identity())

    category = request.args.get("category")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))

    return jsonify(
        filter_transactions(
            user_id=user_id,
            is_admin=is_admin(),
            category=category,
            start_date=start_date,
            end_date=end_date,
            page=page,
            limit=limit
        )
    )

@api.route("/transactions/categories", methods=["GET"])
@jwt_required()
def list_categories():

    user_id = int(
        get_jwt_identity()
    )

    return jsonify(
        get_categories(
            user_id,
            is_admin()
        )
    )
# ========================= USERS =========================

@api.route("/users", methods=["GET"])
@jwt_required()
def list_users():

    if not is_admin():
        abort(
            403,
            description="Admin access required"
        )

    page = request.args.get("page", type=int)
    limit = request.args.get("limit", type=int)

    if page is not None or limit is not None:

        page = page or 1
        limit = limit or 5

        return jsonify(
            get_paginated_users(
                page,
                limit
            )
        )

    return jsonify(get_all_users())

@api.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def edit_user(user_id):

    if not is_admin():
        abort(
            403,
            description="Admin access required"
        )

    data = request.get_json(silent=True)

    if not data:
        raise ValueError("JSON payload required")

    result = update_user(
        user_id,
        data
    )

    return jsonify(result)

@api.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def remove_user(user_id):

    if not is_admin():
        abort(
            403,
            description="Admin access required"
        )


    current_user_id = int(
        get_jwt_identity()
    )

    if current_user_id == user_id:
        raise ValueError(
            "Admin cannot delete own account"
        )


    result = delete_user(user_id)

    return jsonify(result)