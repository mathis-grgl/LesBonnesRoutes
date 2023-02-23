import sqlite3
import requests

connection = sqlite3.connect("database.db")

cursor = connection.cursor()

script = open("backend/db.sql")

cursor.executescript(script.read())

cursor.close()