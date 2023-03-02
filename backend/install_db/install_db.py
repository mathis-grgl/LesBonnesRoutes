import sqlite3

connection = sqlite3.connect("database.db")
cursor = connection.cursor()

with open("backend/install_db/db.sql") as script:
    cursor.executescript(script.read())
with open("backend/install_db/populating.sql") as script:
    cursor.executescript(script.read())
    
cursor.close()