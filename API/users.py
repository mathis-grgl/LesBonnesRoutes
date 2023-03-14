import json
from typing import Any

from flask import jsonify, Response, request, abort

from __main__ import app, check_datas
from connection_info import UserInfo
from database_manager import userManager

@app.route("/api/v1/user", methods=['PUT'])
@check_datas(authentified=False)
def new_user() -> tuple[Response, int]:
    """
    creation of a new user
    """
    data: dict[str, Any] = json.loads(request.data)
    resp, code = userManager.new_user(data)
    if code == 409:
        abort(409, "this email is already used with another account")
    return jsonify(resp), code

@app.route("/api/v1/user/<int:user_id>", methods=['PATCH'])
@check_datas()
def edit_user(user_info: UserInfo, user_id: int) -> tuple[Response, int]:
    """
    edit specified data of a user
    """
    data: dict[str, Any] = json.loads(request.data)
    resp, code = userManager.edit_user(user_info, user_id, data)
    if code in (403, 404):
        abort(code)
    return jsonify(resp), code

@app.route("/api/v1/user/<int:user_id>", methods=['DELETE'])
@check_datas()
def delete_user(user_info: UserInfo, user_id: int) -> tuple[Response, int]:
    """
    remove a user from database (require auth token and password)
    """
    resp, code = userManager.delete_user(user_info, user_id)
    if code in (403, 404):
        abort(code)
    return jsonify(resp), 204

@app.route("/api/v1/user", methods=['POST'])
@check_datas(authentified=False)
def connect_user() -> tuple[Response, int]:
    """
    answer with a token for future connections
    """
    data = json.loads(request.data)
    resp, code = userManager.connect_user(data)
    if code == 401:
        abort(401, "invalid email or password")
    if code == 404:
        abort(404)
    return jsonify(resp), code

@app.route("/api/v1/user/<int:user_id>", methods=['GET'])
@check_datas()
def get_user(user_info: UserInfo, user_id: int) -> tuple[Response, int]:
    """
    get a user
    """
    partial = user_info.user_id != user_id
    user = userManager.get_user(id=user_id, partial=partial)
    if user is None:
        abort(404)
    return jsonify(user), 200
