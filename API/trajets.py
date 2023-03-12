from flask import request, jsonify, Response, abort
import json
from typing import Any

from __main__ import app, check_datas
from lbr_typing import json_dict
from connection_info import UserInfo
from database_manager import trajetManager



@app.route('/api/v1/trajet', methods=['PUT'])
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