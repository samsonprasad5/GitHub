from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from datetime import timedelta

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

standard_daily_hours = 8
fortnightly_standard_hours = 80
strict_start_time = timedelta(hours=8, minutes=0)
flex_start_time = timedelta(hours=8, minutes=30)
strict_end_time = timedelta(hours=17, minutes=0)
lunch_break = timedelta(hours=1)

@app.route('/upload', methods=['POST'])
def upload_file():
    print("Files received:", request.files)
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        df = pd.read_csv(filepath, encoding='ISO-8859-1', skiprows=5, on_bad_lines='skip')
    except Exception as e:
        return jsonify({'error': f'Failed to read CSV: {str(e)}'}), 400

    required_cols = ['ID', 'Name', 'Date', 'Check-In Time', 'Check-Out Time']
    if not all(col in df.columns for col in required_cols):
        return jsonify({'error': 'Missing required columns'}), 400

    df['Check-In Time'] = df['Check-In Time'].astype(str).str.strip()
    df['Check-Out Time'] = df['Check-Out Time'].astype(str).str.strip()
    df['Check-In DateTime'] = pd.to_datetime(df['Date'] + ' ' + df['Check-In Time'], format='%d-%m-%Y %H:%M', errors='coerce')
    df['Check-Out DateTime'] = pd.to_datetime(df['Date'] + ' ' + df['Check-Out Time'], format='%d-%m-%Y %H:%M', errors='coerce')
    df.sort_values(by=['ID', 'Date', 'Check-In DateTime'], inplace=True)

    records = []
    check_in_out_records = []

    for (emp_id, name, date), group in df.groupby(['ID', 'Name', 'Date']):
        group = group.sort_values('Check-In DateTime')
        check_in_time = group['Check-In DateTime'].dropna().min()
        check_out_time = group['Check-Out DateTime'].dropna().max()
        hours_worked = 0

        if pd.isna(check_in_time) or pd.isna(check_out_time):
            check_in_str = "❌ No Check-In" if pd.isna(check_in_time) else check_in_time.strftime('%H:%M')
            check_out_str = "❌ No Check-Out" if pd.isna(check_out_time) else check_out_time.strftime('%H:%M')
            less_hours = standard_daily_hours
            records.append([emp_id, name, date, hours_worked, less_hours])
            check_in_out_records.append({
                "Employee ID": emp_id,
                "Employee Name": name,
                "Date": date,
                "Check-In Time": check_in_str,
                "Check-Out Time": check_out_str,
                "Total Hours Worked": f"{hours_worked:.2f}",
                "Flexi-hours to be claimed": f"{less_hours:.2f}"
            })
        else:
            check_in_td = timedelta(hours=check_in_time.hour, minutes=check_in_time.minute)
            check_out_td = timedelta(hours=check_out_time.hour, minutes=check_out_time.minute)
            adjusted_start = max(check_in_td, strict_start_time)
            adjusted_end = min(check_out_td, strict_end_time)
            work_duration = adjusted_end - adjusted_start - lunch_break
            work_duration = max(work_duration.total_seconds(), 0)
            hours_worked = round(work_duration / 3600, 2)

            if strict_start_time <= check_in_td <= flex_start_time:
                required_checkout = check_in_td + timedelta(hours=9)
                if check_out_td >= required_checkout:
                    hours_worked = 8.0
                else:
                    work_duration = adjusted_end - adjusted_start - timedelta(hours=1)
                    hours_worked = round(max(work_duration.total_seconds() / 3600, 0), 2)
            else:
                work_duration = adjusted_end - adjusted_start - timedelta(hours=1)
                hours_worked = round(max(work_duration.total_seconds() / 3600, 0), 2)

            less_hours = round(max(standard_daily_hours - hours_worked, 0), 2)

            records.append([emp_id, name, date, hours_worked, less_hours])
            check_in_out_records.append({
                "Employee ID": emp_id,
                "Employee Name": name,
                "Date": date,
                "Check-In Time": check_in_time.strftime('%H:%M'),
                "Check-Out Time": check_out_time.strftime('%H:%M'),
                "Total Hours Worked": f"{hours_worked:.2f}",
                "Flexi-hours to be claimed": f"{less_hours:.2f}"
            })

    summary_df = pd.DataFrame(records, columns=[
        "Employee ID", "Employee Name", "Date", "Total Hours Worked", "Flexi-hours to be claimed"
    ])

    fortnight_summary = summary_df.groupby(['Employee ID', 'Employee Name']).agg({
        'Total Hours Worked': 'sum',
    }).reset_index()

    fortnight_summary['Less Hours in Fortnight'] = fortnight_summary['Total Hours Worked'].apply(
        lambda h: round(max(fortnightly_standard_hours - h, 0), 2)
    )

    check_in_out_df = pd.DataFrame(check_in_out_records)

    # Optionally save to CSV
    summary_df.to_csv("daily_employee_summary.csv", index=False)
    fortnight_summary.to_csv("employee_fortnightly_summary.csv", index=False)
    check_in_out_df.to_csv("employee_check_in_out_details.csv", index=False)

    return jsonify({
        'checkInOutDetails': check_in_out_records,
        'fortnightSummary': fortnight_summary.to_dict(orient='records')
    })

if __name__ == '__main__':
   app.run(host="0.0.0.0", debug=True)

