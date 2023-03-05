from __future__ import annotations
from typing import Any, Optional
import json

import jsonschema
from jsonschema import ValidationError

import databaseManager
from Entity import Entity

class User(Entity):

    fields = (
        "nomCompte", 
        "prenomCompte", 
        "email", 
        "genre", 
        "voiture", 
        "telephone", 
        "mdp", 
        "notificationMail"
    )

    @classmethod
    def new(cls, data: dict[str, Any]) -> User:
        cls.check(data)
        ret = databaseManager.new_user(data)
        print(ret)
        return User(0)
        
    
    @classmethod
    def get(cls, id: int) -> User:
        pass

    @classmethod
    def check(cls, data: dict[str, str]) -> dict[str, str]:
        schema = json.load(open("./backend/jsonschemas/new_user.json"))
        try:
            jsonschema.validate(data, schema)
        except ValidationError:
            return {}
        else:
            return data

    def __init__(self, id: Optional[int], *, invalid:dict[str, str]={}):
        self.attr: dict[str, str] = dict.fromkeys(self.fields, "")
        self.invalid: dict[str, str] = invalid
        self.id: Optional[int] = id

    def update(self, data: dict[str, Any]) -> None:
        pass

    def toJSON(self, *, partial:bool=False) -> dict[str, str]:
        if self.id is None:
            return self.invalid
        else:
            return self.attr
