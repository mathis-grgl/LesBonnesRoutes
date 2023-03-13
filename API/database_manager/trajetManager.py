from functools import lru_cache
import sqlite3
from typing import Final

from lbr_typing import json_dict, json_list
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

    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    query = f"""
    INSERT INTO TRAJET({", ".join(map(str, data.keys()))})
    VALUES ({", ".join("?"*len(data))})
    """
    c = cursor.execute(query, list(data.values()))
    trajet_id = c.lastrowid
    connection.commit()
    connection.close()

    try:
        res = get_trajet(trajet_id)
    except ValueError:
        return {}, 400
    return res, 200


def get_trajet(id: int) -> json_dict:

    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    query = """
    SELECT *
    FROM TRAJET
    WHERE idTrajet = ?
    """
    cursor.execute(query, (id,))
    rows = cursor.fetchone()
    connection.close()
    res: json_dict = dict(zip(TRAJET_ATTR, rows))
    id_conducteur = res.pop("idConducteur")
    try:
        res["conducteur"] = userManager.get_user(id=id_conducteur, partial=True)
    except ValueError:
        raise ValueError(f"aucun trajet correspondant (id: {id})")
    res["villeDepart"] = get_ville(res["villeDepart"])
    res["villeArrivee"] = get_ville(res["villeArrivee"])
    return res


def search_trajet(data: json_dict) -> tuple[json_list, int]:
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    
    conditions = " AND ".join(f"{critera} = ?" for critera in data.keys())
    
    query = f"""
    SELECT idTrajet
    FROM TRAJET
    {"WHERE" if conditions else ""} {conditions}
    """
    cursor.execute(query, list(data.values()))
    rows = cursor.fetchall()
    res = []
    for row in rows:
        res.append(get_trajet(row[0]))
    connection.close()
    return res, 200