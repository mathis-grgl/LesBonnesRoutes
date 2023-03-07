from functools import wraps
from typing import Any, Callable
import json

import flask
from flask import abort, request, jsonify, Response
import jsonschema
from werkzeug.exceptions import HTTPException
from jsonschema.exceptions import ValidationError

import databaseManager

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


def check_datas(authentified:bool=True):
    def wrapper(f: Callable):
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
    return jsonify(resp), code


@app.route("/api/v1/user/<int:user_id>", methods=['PATCH'])
@check_datas()
def edit_user(user_id: int) -> Response:
    """
    edit specified data of a user
    """
    data: dict[str, Any] = json.loads(request.data)
    databaseManager.edit_user(user_id, data)
    return jsonify()

@app.route("/api/v1/user/<int:user_id>", methods=['DELETE'])
def delete_user(user_id: int) -> Response:
    """
    remove a user from database (require auth token and password)
    """
    return jsonify()

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
def get_user(user_id: int) -> Response:
    return jsonify()

if __name__ == "__main__":
    app.run()