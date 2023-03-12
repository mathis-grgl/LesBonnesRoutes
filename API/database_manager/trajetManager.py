from functools import lru_cache
import sqlite3
from typing import Final

from lbr_typing import json_dict
from connection_info import UserInfo
from database_manager import userManager

DATABASE_NAME: Final[str] = "database.db"

TRAJET_ATTR: Final[tuple[str, ...]] = (
    "idTrajet",
    "idConducteur",
    "dateDepart",
    "nbPlaces",
    "prix",
    "nbPlacesRestantes",
    "statusTrajet",
    "commentaires",
    "precisionRdv",
    "villeDepart",
    "villeArrivee"
)
TRAJET_PARTIAL_ATTR: Final[tuple[str, ...]] = ()

@lru_cache
def get_ville(id: int) -> json_dict:
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    query = """
    SELECT *
    FROM VILLE
    WHERE idVille = ?"""
    cursor.execute(query, (id,))
    rows = cursor.fetchone()
    return dict(zip(("id", "nom", "codePostal"), rows))


def new_trajet(user_info: UserInfo, data: json_dict) -> tuple[json_dict, int]:

    data["statusTrajet"] = "A pourvoir"
    data["idConducteur"] = user_info.user_id

    # doing request
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    query = f"""
    INSERT INTO TRAJET({", ".join(map(str, data.keys()))})
    VALUES ({", ".join("?"*len(data))})
    """
    c = cursor.execute(query, list(data.values()))
    query = """
    SELECT *
    FROM TRAJET
    WHERE idTrajet = ?
    """
    cursor.execute(query, (c.lastrowid,))
    rows = cursor.fetchone()

    connection.commit()
    connection.close()
    res: json_dict = dict(zip(TRAJET_ATTR, rows))
    idConducteur = res.pop("idConducteur")
    res["conducteur"] = userManager.get_user(id=idConducteur, partial=True)
    res["villeDepart"] = get_ville(res["villeDepart"])
    res["villeArrivee"] = get_ville(res["villeArrivee"])
    return res, 200