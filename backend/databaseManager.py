from typing import Any, Final

import sqlite3

DATABASE_NAME: Final[str] = "database.db"
# INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail)
#    VALUES ('DURAND', 'Olivier', 'olivier@mail.com', 'homme', 1, 0606060606, 'mdpOlivier', 0);
def new_user(data: dict[str, Any]) -> int:
    connection = sqlite3.connect(DATABASE_NAME)
    cursor = connection.cursor()

    nbr_param = ", ".join("?"*len(data))

    query = f"""
        INSERT INTO COMPTE(nomCompte, prenomCompte, email, genre, voiture, telephone, mdp, notificationMail)
        VALUES ({nbr_param})"""

    cursor.execute(query, list(data.values()))
    connection.commit()
    return 0

def check_user_exist(id: int) -> bool:
    return False