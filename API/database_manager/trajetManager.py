from functools import lru_cache
import sqlite3
from typing import Final, Optional

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


def get_trajet(id: int, partial: bool=False) -> Optional[json_dict]:

    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    query = """
    SELECT *
    FROM TRAJET
    WHERE idTrajet = ?
    """
    cursor.execute(query, (id,))
    rows = cursor.fetchone()
    
    if rows is None:
        connection.close()
        return
    res: json_dict = dict(zip(TRAJET_ATTR, rows))
    id_conducteur = res.pop("idConducteur")
    res["conducteur"] = userManager.get_user(id=id_conducteur, partial=True)
    res["villeDepart"] = get_ville(res["villeDepart"])
    res["villeArrivee"] = get_ville(res["villeArrivee"])
    
    if not partial:
        query = """
        SELECT idCompte
        FROM TRAJET_EN_COURS_PASSAGER
        WHERE idTrajet = ?"""
        cursor.execute(query, (id,))
        rows = cursor.fetchall()
        res["passagers"] = [userManager.get_user(id=i[0], partial=True) for i in rows]

    connection.close() 
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
        res.append(get_trajet(row[0], partial=True))
    connection.close()
    return res, 200


def edit_trajet(user_info: UserInfo, trajet_id: int, data: json_dict) -> tuple[json_dict, int]:
    trajet = get_trajet(trajet_id, partial=True)
    if trajet is None:
        return {}, 404
    if (not user_info.isAdmin) and (user_info.user_id != trajet["conducteur"]["idCompte"]):
        return {}, 403

    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    for param, value in data.items():
        query = f"""
            UPDATE TRAJET
            SET {param} = ?
            WHERE idTrajet = {trajet_id}"""
        cursor.execute(query, (value,))
    connection.commit()
    connection.close()
    return get_trajet(trajet_id), 200


def delete_trajet(user_info: UserInfo, trajet_id: int) -> tuple[json_dict, int]:

    trajet = get_trajet(trajet_id, partial=True)
    if trajet is None:
        return {}, 404
    if (not user_info.isAdmin) and (user_info.user_id != trajet["conducteur"]["idCompte"]):
        return {}, 403
    query = """DELETE FROM TRAJET WHERE idTrajet = ?"""
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    cursor.execute(query, (trajet_id,))
    connection.commit()
    connection.close()
    return {}, 204

def add_passengers(user_info: UserInfo, trajet_id: int, data: json_dict) -> tuple[json_dict, int]:
    trajet = get_trajet(trajet_id, partial=True)
    if trajet is None:
        print("DEBUG: trajet n'existe pas")
        return {}, 404
    if (not user_info.isAdmin) and (user_info.user_id != trajet["conducteur"]["idCompte"]):
        return {}, 403
    if any(user is None for user in map(userManager.get_user, data["idPassagers"])):
        print("DEBUG: utilisateur n'existe pas")
        return {}, 404
    query = """
    INSERT
    INTO TRAJET_EN_COURS_PASSAGER
    VALUES(?, ?)"""
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    try:
        cursor.execute(query, (trajet_id,))
        connection.commit()
    except sqlite3.IntegrityError:
        return {}, 409
    connection.close()

    return get_trajet(trajet_id), 200