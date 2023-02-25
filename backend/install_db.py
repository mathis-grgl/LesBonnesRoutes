import sqlite3

connection = sqlite3.connect("database.db")
cursor = connection.cursor()

with open("backend/db.sql") as script:
    cursor.executescript(script.read())
with open("backend/populating.sql") as script:
    cursor.executescript(script.read())
    
cursor.close()