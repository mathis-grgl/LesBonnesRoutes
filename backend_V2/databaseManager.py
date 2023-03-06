import random
import sqlite3
from sqlite3 import SQLITE_CONSTRAINT_UNIQUE
from string import ascii_letters, digits
from typing import Any, Final, Optional

from argon2 import PasswordHasher


DATABASE_NAME: Final[str] = "database.db"

USER_ATTR: tuple[str, ...] = ("idCompte", "nomCompte", "prenomCompte", "email", "genre", "voiture", "telephone", "notificationMail")
USER_PARTIAL_ATTR: tuple[str, ...] = ("idCompte", "nomCompte", "prenomCompte", "genre", "voiture")

TRAJET_ATTR: tuple[str, ...]
TRAJET_PARTIAL_ATTR: tuple[str, ...]


def generate_token() -> str:
    charset = ascii_letters + digits
    return "".join(random.choices(charset, k=128))


def new_user(data: dict[str, Any]) -> tuple[dict, int]:
    
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

    user = get_user(data["email"])
    user["voiture"] = bool(user["voiture"])
    user["notificationMail"] = bool(user["notificationMail"])
    return user, 201


def get_user(mail: str, partial:bool=False):
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
    return dict(zip(members, row))


def edit_user(user_id: int, data: dict[str, Any]) -> tuple[dict, int]:
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
