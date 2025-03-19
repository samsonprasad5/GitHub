from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Initialize database
def init_db():
    with sqlite3.connect("pay_records.db") as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hours_worked REAL,
                hourly_rate REAL,
                tax_rate REAL,
                required_hours REAL,
                gross_pay REAL,
                net_pay REAL,
                missing_hours REAL
            )
        ''')
        conn.commit()

init_db()

@app.route('/')
def home():
    return render_template('Pay.html')

@app.route('/calculate', methods=['POST'])
def calculate_pay():
    data = request.json
    hours_worked = float(data.get('hours', 0))
    hourly_rate = float(data.get('rate', 0))
    tax_rate = float(data.get('tax', 0.1))
    required_hours = float(data.get('required_hours', 40))

    gross_pay = hours_worked * hourly_rate
    tax_deduction = gross_pay * tax_rate
    net_pay = gross_pay - tax_deduction
    missing_hours = max(0, required_hours - hours_worked)

    # Save to database
    with sqlite3.connect("pay_records.db") as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO records (hours_worked, hourly_rate, tax_rate, required_hours, gross_pay, net_pay, missing_hours)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (hours_worked, hourly_rate, tax_rate, required_hours, gross_pay, net_pay, missing_hours))
        conn.commit()

    return jsonify({
        'gross_pay': round(gross_pay, 2),
        'net_pay': round(net_pay, 2),
        'missing_hours': round(missing_hours, 2)
    })

@app.route('/records', methods=['GET'])
def get_records():
    with sqlite3.connect("pay_records.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM records ORDER BY id DESC")
        records = cursor.fetchall()
    return jsonify(records)

if __name__ == '__main__':
    app.run(debug=True)
