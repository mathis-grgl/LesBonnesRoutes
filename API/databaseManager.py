from datetime import datetime, timedelta
import sqlite3
from sqlite3 import SQLITE_CONSTRAINT_UNIQUE
import secrets
from typing import Final, TypeAlias, Union

from argon2 import PasswordHasher
from argon2.exceptions import VerificationError

json_dict: TypeAlias = dict[str, Union[str, int, bool, "json_dict"]]

DATABASE_NAME: Final[str] = "database.db"

USER_ATTR: tuple[str, ...] = ("idCompte", "nomCompte", "prenomCompte", "email", "genre", "voiture", "telephone", "notificationMail")
USER_PARTIAL_ATTR: tuple[str, ...] = ("idCompte", "nomCompte", "prenomCompte", "genre", "voiture")

TRAJET_ATTR: tuple[str, ...]
TRAJET_PARTIAL_ATTR: tuple[str, ...]


def generate_token() -> str:
    return secrets.token_hex(64)


def check_token(token: str) -> bool:
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    query = "SELECT expiration FROM TOKEN WHERE auth_token = ?"
    cursor.execute(query, (token,))
    result = cursor.fetchone()
    connection.close()

    if result is None:
        return False
    expiration = datetime.fromisoformat(result)
    if expiration < datetime.now():
        return False
    return True




def new_user(data: json_dict) -> tuple[json_dict, int]:
    
    # hashing password
    hasher = PasswordHasher()
    data["mdp"] = hasher.hash(data["mdp"])

    # doing request
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    query = """INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)"""

    try:
        cursor.execute(query, list(data.values()))
        connection.commit()
    except sqlite3.IntegrityError as e:
        if e.sqlite_errorcode == SQLITE_CONSTRAINT_UNIQUE:
            connection.close()
            return {}, 409
    finally:
        connection.close()

    return get_user(data["email"]), 201


def get_user(mail: str, partial:bool=False) -> json_dict:
    if partial:
        members = USER_PARTIAL_ATTR
    else:
        members = USER_ATTR
    query = f"""
        SELECT {", ".join(members)}
        FROM COMPTE
        WHERE email=?"""
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    cursor.execute(query, (mail,))
    row = cursor.fetchone()
    connection.close()
    if row is None:
        return {}
    result =  dict(zip(members, row))
    result["voiture"] = bool(result["voiture"])
    result["notificationMail"] = bool(result["notificationMail"])
    return result


def edit_user(user_id: int, data: json_dict) -> tuple[json_dict, int]:
    query = f"""
        UPDATE COMPTE
        SET ?=?
        WHERE id = ?"""

    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    cursor.execute(query)
    row = cursor.fetchone()
    connection.close()

    return {}, 0


def connect_user(data: json_dict) -> tuple[json_dict, int]:
    # password check
    query = "SELECT mdp FROM COMPTE WHERE email = ?"
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    cursor.execute(query, (data["email"],))
    res = cursor.fetchone()
    if res is not None:
        mdp, = res
    else:
        return {}, 401
    hasher = PasswordHasher()
    try:
        hasher.verify(mdp, data["mdp"])
    except VerificationError:
        connection.close()
        return {}, 401
    
    token = generate_token()
    user = get_user(data["email"])
    query = "INSERT INTO TOKEN VALUES (?, ?, ?)"
    date = datetime.now()
    date += timedelta(hours=1)
    cursor.execute(query, (user["idCompte"], token, date.isoformat()))
    connection.commit()
    connection.close()
    return {"auth_token": token, "user": user}, 200




