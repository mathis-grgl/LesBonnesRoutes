from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/trajets')
def get_trajets():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM COMPTE")
    rows = c.fetchall()
    conn.close()
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)
