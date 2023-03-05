import random
import sqlite3
from sqlite3 import SQLITE_CONSTRAINT_UNIQUE
from string import ascii_letters, digits
from typing import Any, Final, Optional

from argon2 import PasswordHasher

from User import User

DATABASE_NAME: Final[str] = "database.db"

def generate_token() -> str:
    charset = ascii_letters + digits
    return "".join(random.choices(charset, k=128))


def new_user(data: dict[str, Any]) -> tuple[Optional[User], int]:
    
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
            return None, 409
    finally:
        connection.close()

    get_user(data["email"])
    return User(0), 201

def get_user(mail: str, partial:bool=False):
    if partial:
        members = "nomCompte", "prenomCompte", "genre", "voiture"
    else:
        members = "nomCompte", "prenomCompte", "email", "genre", "voiture", "telephone", "notificationMail"
    query = f"""
        SELECT {members}
        FROM COMPTE
        WHERE email=?"""
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()
    print(query)
    print(mail)
    cursor.execute(query, (mail,))
    row = cursor.fetchone()
    print(row)
    connection.close()
    

    
