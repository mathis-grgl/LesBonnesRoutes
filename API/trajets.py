from flask import request, jsonify, Response, abort
import json
from typing import Any

from __main__ import app, check_datas
from lbr_typing import json_dict
from connection_info import UserInfo
from database_manager import trajetManager



@app.route("/api/v1/trajet", methods=["PUT"])
@check_datas()
def new_trajet(user_info: UserInfo) -> tuple[Response, int]:
    """
    creation of a new trajet
    """
    data: dict[str, Any] = json.loads(request.data)
    resp, code = trajetManager.new_trajet(user_info, data)
    if code == 400:
        abort(400, "invalid datas")
    return jsonify(resp), code

@app.route("/api/v1/trajet", methods=["GET"])
@check_datas()
def search_trajet(user_info: UserInfo) -> tuple[Response, int]:
    data: dict[str, Any] = json.loads(request.data)
    resp, code = trajetManager.search_trajet(data)
    return jsonify(resp), code

@app.route("/api/v1/trajet/<int:trajet_id>", methods=["GET"])
@check_datas()
def get_trajet(user_info: UserInfo, trajet_id: int) -> tuple[Response, int]:
    trajet = trajetManager.get_trajet(trajet_id)
    if trajet is None:
        abort(404, f"no trajet found with ID {trajet_id}")
    return jsonify(trajet), 200


@app.route("/api/v1/trajet/<int:trajet_id>", methods=["PATCH"])
@check_datas()
def edit_trajet(user_info: UserInfo, trajet_id: int) -> tuple[Response, int]:
    data: dict[str, Any] = json.loads(request.data)
    resp, code = trajetManager.edit_trajet(user_info, trajet_id, data)
    if code == 403:
        abort(403)
    return jsonify(resp), code


@app.route("/api/v1/trajet/<int:trajet_id>", methods=["DELETE"])
@check_datas()
def delete_trajet(user_info: UserInfo, trajet_id: int) -> tuple[Response, int]:
    resp, code = trajetManager.delete_trajet(user_info, trajet_id)
    if code == 403:
        abort(403)
    return jsonify(resp), 204
