from datetime import datetime, timedelta
import sqlite3
from sqlite3 import SQLITE_CONSTRAINT_UNIQUE
import secrets
from typing import Final, Optional

from argon2 import PasswordHasher
from argon2.exceptions import VerificationError

from lbr_typing import json_dict
from connection_info import UserInfo

DATABASE_NAME: Final[str] = "database.db"

USER_ATTR: Final[tuple[str, ...]] = ("idCompte", "nomCompte", "prenomCompte", "email", "genre", "voiture", "telephone", "notificationMail", "isAdmin")
USER_PARTIAL_ATTR: Final[tuple[str, ...]] = ("idCompte", "nomCompte", "prenomCompte", "genre", "voiture")

TRAJET_ATTR: Final[tuple[str, ...]] = ()
TRAJET_PARTIAL_ATTR: Final[tuple[str, ...]] = ()


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
        print("DEBUG: AUCUN TOKEN NE MATCH")
        return False
    expiration = datetime.fromisoformat(result[0])
    if expiration < datetime.now():
        print("DEBUG: TOKEN EXPIRÉ")
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


def get_user(mail: Optional[str]=None, id: Optional[int]=None, partial: bool=False) -> json_dict:
    if mail is None and id is None:
        raise ValueError("mail or id must be provided")
    if mail is not None and id is not None:
        raise ValueError("mail or id must be provided, not both")
    
    if partial:
        members = USER_PARTIAL_ATTR
    else:
        members = USER_ATTR
    query = f"""
        SELECT {", ".join(members)}
        FROM COMPTE
        WHERE {'email' if mail is not None else 'idCompte'}=?"""
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    cursor.execute(query, (mail if mail is not None else id,))
    row = cursor.fetchone()
    connection.close()
    if row is None:
        raise Exception(f"aucun compte correspondant (id: {id}, email: {mail})")
    result =  dict(zip(members, row))
    result["voiture"] = bool(result["voiture"])
    result["notificationMail"] = bool(result["notificationMail"])
    return result


def get_user_from_token(token: str) -> Optional[json_dict]:
    if not check_token(token):
        return
    query = """
        SELECT idCompte
        FROM TOKEN
        WHERE auth_token=?"""
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    cursor.execute(query, (token,))
    res = cursor.fetchone()
    if res is None:
        return
    return get_user(res[0])


def get_userinfo_from_token(token: str) -> Optional[UserInfo]:
    if not check_token(token):
        return None
    query = """
        SELECT c.idCompte, c.isAdmin
        FROM COMPTE c, TOKEN t
        WHERE t.auth_token = ? AND t.idCompte = c.idCompte
        """
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    cursor.execute(query, (token,))
    res = cursor.fetchone()
    if res is None:
        return 
    return UserInfo(*res)


def edit_user(user_info: UserInfo, user_id: int, data: json_dict) -> tuple[json_dict, int]:
    if (not user_info.isAdmin) and (user_info.user_id != user_id):
        return {}, 403

    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    for param, value in data.items():
        query = f"""
            UPDATE COMPTE
            SET {param} = ?
            WHERE idCompte = {user_id}"""
        cursor.execute(query, (value,))
    connection.commit()
    connection.close()
    return user_info.user, 200


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


def delete_user(user_info: UserInfo, user_id: int) -> tuple[json_dict, int]:
    if (not user_info.isAdmin) and (user_info.user_id != user_id):
        return {}, 403
    
    query = """DELETE FROM COMPTE WHERE idCompte = ?"""
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    cursor.execute(query, (user_id,))
    connection.commit()
    connection.close()
    return {}, 204
