# 🧾 Pay Calculator – React & Flask Application

A web-based Pay Calculator that allows users to upload attendance CSV files, automatically calculates total working hours, identifies flexi-hours to be claimed, and provides a summary of hours worked over a fortnight.

## ✨ Features

- ✅ Upload CSV attendance files (with check-in and check-out times)
- 🕒 Automatically calculate daily total working hours
- 📉 Identify less time (compared to standard 8 hours/day)
- 📊 Generate fortnight summary of hours worked
- 🌐 Clean React frontend using Bootstrap
- 🔁 Flask backend for CSV processing using Pandas & NumPy

## 🧰 Tech Stack

### 🔹 Backend (Python / Flask)


- **python** -version (3.12.9)
- **Flask** – For building the API server v--3.1.0
- **Flask-CORS** – To allow cross-origin requests from the frontend v--5.0.1
- **Pandas** – For reading and processing CSV data v--2.2.3
- **NumPy** – For numerical operations and rounding v--2.2.4
- **Tabulate** *(optional)* – For table formatting in terminal (if needed)
- **datetime** – For time calculations and handling time deltas
- **os** – For file path operations
- **io (StringIO)** – For in-memory file handling (if used)

### 🔹 Frontend (React)

- **React.js** – For building the frontend UI
- **Axios** – For sending HTTP requests to the backend
- **Bootstrap** – For styling and layout
- 
⚙️ Installation & Setup
  
Backend Setup (Flask API)

•	Create a virtual environment (optional but recommended):
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

•	Install dependencies:

•	Run the Flask backend server:
python app.py

•	Backend server runs on:
http://localhost:5000

Frontend Setup (React)

•	Navigate to the frontend directory:
cd frontend

•	Install dependencies (if cloning or restoring the project):
npm install

•	Start the React development server:
npm start

•	Open your browser to:
http://localhost:3000

