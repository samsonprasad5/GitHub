from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///licenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Model
class License(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    software_name = db.Column(db.String(100), nullable=False)
    vendor = db.Column(db.String(100), nullable=False)
    license_type = db.Column(db.String(50), nullable=False)
    purchase_date = db.Column(db.Date, nullable=False)
    expiry_date = db.Column(db.Date, nullable=False)
    cost = db.Column(db.Float, nullable=False)
    license_key = db.Column(db.String(255), nullable=True)
    assigned_to = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(50), nullable=False, default='Active')

# Route to get all licenses
@app.route('/api/licenses', methods=['GET'])
def get_licenses():
    licenses = License.query.all()
    return jsonify([{
        'id': lic.id,
        'software_name': lic.software_name,
        'vendor': lic.vendor,
        'license_type': lic.license_type,
        'purchase_date': lic.purchase_date.strftime('%Y-%m-%d'),
        'expiry_date': lic.expiry_date.strftime('%Y-%m-%d'),
        'cost': lic.cost,
        'license_key': lic.license_key,
        'assigned_to': lic.assigned_to,
        'status': lic.status
    } for lic in licenses])

# Route to add a new license
@app.route('/api/licenses', methods=['POST'])
def add_license():
    data = request.json
    new_license = License(
        software_name=data['software_name'],
        vendor=data['vendor'],
        license_type=data['license_type'],
        purchase_date=datetime.strptime(data['purchase_date'], '%Y-%m-%d'),
        expiry_date=datetime.strptime(data['expiry_date'], '%Y-%m-%d'),
        cost=data['cost'],
        license_key=data.get('license_key'),
        assigned_to=data.get('assigned_to'),
        status=data['status']
    )
    db.session.add(new_license)
    db.session.commit()
    return jsonify({'message': 'License added successfully!'}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if not exist
    app.run(debug=True)
