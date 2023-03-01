import uuid
import json

import flask
from flask import abort, request, jsonify

from User import User

app = flask.Flask(__name__)
app.config["debug"] = True

token_cache = {}


@app.route("/api/v1/user", methods=['PUT'])
def new_user():
    data: dict = json.loads(request.data)
    user = User.new(data)
    status: int = 201 if not user.invalid else 400
    return jsonify(user.toJSON()), status


@app.route("/api/v1/user/<user_id>", methods=['PATCH'])
def edit_user(user_id):
    return jsonify()

@app.route("/ping/", methods=["POST"])
def ping():
    return jsonify("pong")

if __name__ == "__main__":
    app.run()