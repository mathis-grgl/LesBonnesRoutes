from functools import wraps
from typing import Any, Callable
import json

import flask
from flask import abort, request
import jsonschema
from werkzeug.exceptions import HTTPException
from jsonschema.exceptions import ValidationError

from database_manager import userManager

app = flask.Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
app.config["debug"] = True

def get_app() -> flask.Flask:
    return app

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
                if not userManager.check_token(token):
                    abort(401, "invalid or expired token")
                user_info = userManager.get_userinfo_from_token(token)
                return f(user_info, *args, **kwargs)
            return f(*args, **kwargs)
        return inner
    return wrapper


if __name__ == "__main__":
    import users
    import trajets
    app.run()