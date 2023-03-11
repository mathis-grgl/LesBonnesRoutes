from functools import wraps
from typing import Any, Callable
import json

import flask
from flask import abort, request, jsonify, Response
import jsonschema
from werkzeug.exceptions import HTTPException
from jsonschema.exceptions import ValidationError

import databaseManager
from connection_info import UserInfo

app = flask.Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
app.config["debug"] = True

@app.errorhandler(HTTPException)
def handle_exception(e):
    """
    Return JSON instead of HTML for HTTP errors.
    """
    response = e.get_response()
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response


def check_datas(authentified:bool=True) -> Callable:
    def wrapper(f: Callable) -> Callable:
        @wraps(f)
        def inner(*args, **kwargs):
            try:
                data: dict[str, Any] = json.loads(request.data)
                schema = json.load(open(f"./API/jsonschemas/{f.__name__}.json"))
                jsonschema.validate(data, schema)
            except json.decoder.JSONDecodeError: # json.load
                abort(400, "invalid json document")
            except ValidationError: # jsonshema.validate
                abort(400, "invalid datas")
            if authentified:
                token = request.headers.get("auth_token")
                if token is None:
                    abort(401, "no token supplied")
                if not databaseManager.check_token(token):
                    abort(401, "invalid or expired token")
                user_info = databaseManager.get_userinfo_from_token(token)
                return f(user_info, *args, **kwargs)
            return f(*args, **kwargs)
        return inner
    return wrapper


@app.route("/api/v1/user", methods=['PUT'])
@check_datas(authentified=False)
def new_user() -> tuple[Response, int]:
    """
    creation of a new user
    """
    data: dict[str, Any] = json.loads(request.data)
    resp, code = databaseManager.new_user(data)
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
    resp, code = databaseManager.edit_user(user_info, user_id, data)
    if code == 403:
        abort(403)
    return jsonify(resp), code

@app.route("/api/v1/user/<int:user_id>", methods=['DELETE'])
@check_datas()
def delete_user(user_info: UserInfo, user_id: int) -> tuple[Response, int]:
    """
    remove a user from database (require auth token and password)
    """
    resp, code = databaseManager.delete_user(user_info, user_id)
    if code == 403:
        abort(403)
    return jsonify(resp), 204

@app.route("/api/v1/user", methods=['POST'])
@check_datas(authentified=False)
def connect_user() -> tuple[Response, int]:
    """
    answer with a token for future connections
    """
    data = json.loads(request.data)
    resp, code = databaseManager.connect_user(data)
    if resp == {}:
        abort(401, "invalid email or password")
    return jsonify(resp), code

@app.route("/api/v1/user/<int:user_id>", methods=['GET'])
@check_datas()
def get_user(user_info: UserInfo, user_id: int) -> tuple[Response, int]:
    partial = not (user_info.user_id == user_id)
    user = databaseManager.get_user(partial=partial)
    if user is None:
        abort(404, f"no user found with ID {user_id}")
    return jsonify(user), 200

if __name__ == "__main__":
    app.run()