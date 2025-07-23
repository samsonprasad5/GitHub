import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000'; // fallback
  const handleUpload = async () => {
    setError(null); // clear previous errors

    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // key MUST be 'file'

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = `Server responded with status ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.error) {
            errorMsg = errData.error;
          }
        } catch { }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      setData(result.checkInOutDetails || []);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message);
    }
  };

  // ✅ Download CSV function
const downloadCSV = () => {
  if (data.length === 0) return;

  const headers = [
    "Employee ID",
    "Employee Name",
    "Date",
    "Check-In Time",
    "Check-Out Time",
    "Total Hours Worked",
    "Flexi-hours to be claimed"
  ];

  const csvHeader = headers.join(',') + '\n';

  const csvRows = data.map(row =>
    headers.map(header => `"${row[header] ?? ''}"`).join(',')
  ).join('\n');

  const csvContent = csvHeader + csvRows;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'check_in_out_details.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  return (
    <div className="container mt-5">
      <h2 className="mb-4">CSV File Upload</h2>

      <div className="mb-3">
        <input
          type="file"
          accept=".csv"
          className="form-control"
          onChange={e => setFile(e.target.files[0])}
        />
      </div>

      <button className="btn btn-primary" onClick={handleUpload}>
        Upload
      </button>

      {error && (
        <div className="alert alert-danger mt-4" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && data.length > 0 && (
        <div className="mt-5">
          <h4>Upload Results</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover mt-3">
              <thead className="table-dark">
                <tr>
                  {Object.keys(data[0]).map((key, index) => (
                    <th key={index}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, colIdx) => (
                      <td key={colIdx}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Download CSV button */}
          <button className="btn btn-success mt-3" onClick={downloadCSV}>
            Download as CSV
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
