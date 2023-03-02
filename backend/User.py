from typing import Self, Any, Optional
import re

import databaseManager
from Entity import Entity
from exceptions import UnknownUserException

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
    def new(cls, data: dict[str, Any]) -> Self:
        errors = {}
        for name in cls.fields:
            if name not in data.keys():
                errors[name] = "must be provided"
        errors.update(cls.check(data))

        if errors:
            return User(None, invalid=errors)
        else:
            return User(databaseManager.new_user(data))
        
    
    @classmethod
    def get(cls, id: int) -> Self:
        if databaseManager.check_user_exist(id):
            return User(id)
        else:
            raise UnknownUserException(f"invalid user_id: {id}")

    @classmethod
    def check(cls, data) -> dict[str, str]:
        regex: dict[str, str] = {
            "nomCompte": r"^[A-Za-z-' ]+$",
            "prenomCompte": r"^[A-Za-z-' ]+$",
            "email": r".+@.+\.[A-Za-z]{2,}",
            "genre": r"^homme|femme|autre$",
            "voiture": "//boolean",
            "telephone": r"^[0-9]{10}$",
            "mdp": r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
            "notificationMail": "// boolean"
        }
        result: dict[str, str] = {}
        for name, value in data.items():
            if name in cls.fields:
                if not re.match(regex[name], value):
                    result[name] = f"{name} does not match the regex {regex[name]}"
        return result

    def __init__(self, id: Optional[int], *, invalid:dict[str, str]={}):
        self.attr: dict[str, str] = dict.fromkeys(self.fields, "")
        self.invalid: dict[str, str] = invalid
        self.id: Optional[int] = id

    def commit(self) -> None:
        pass

    def toJSON(self) -> dict[str, str]:
        if self.id is None:
            return self.invalid
        else:
            return self.attr
