from typing import Any

class JSONCheck:

    def __init__(self, model: dict[str, tuple[type, None | str]]):
        self.model = model

    def check_all(self, data: dict[str, Any]):
        pass

    def check_field(self):
        pass

user = {
    "nomCompte":        (str, r"^[A-Za-z-' ]+$"),
    "prenomCompte":     (str, r"^[A-Za-z-' ]+$"),
    "email":            (str, r".+@.+\.[A-Za-z]{2,}"),
    "genre":            (str, r"^homme|femme|autre$"),
    "voiture":          (bool, None),
    "telephone":        (str, r"^[0-9]{10}$"),
    "mdp":              (str, r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"),
    "notificationMail": (bool, None)
}

j = JSONCheck(user)