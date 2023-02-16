import sqlite3

connection = sqlite3.connect("database.db")

cursor = connection.cursor()

script = open("backend/db.sql")

cursor.executescript(script.read())