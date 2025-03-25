document.getElementById("calculatorForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get values from inputs
    let hoursWorked = parseFloat(document.getElementById("hoursWorked").value);
    let hourlyRate = parseFloat(document.getElementById("hourlyRate").value);
    let expectedHours = parseFloat(document.getElementById("expectedHours").value);

    const fileInput = document.getElementById("fileUpload");
    if (fileInput.files.length > 0) {
        // If an Excel file is uploaded, process it
        const file = fileInput.files[0];
        readExcelFile(file, function(data) {
            hoursWorked = data.hoursWorked || hoursWorked;
            hourlyRate = data.hourlyRate || hourlyRate;
            expectedHours = data.expectedHours || expectedHours;
            calculatePay(hoursWorked, hourlyRate, expectedHours);
        });
    } else {
        // If no file is uploaded, use input values
        calculatePay(hoursWorked, hourlyRate, expectedHours);
    }
});

// Function to calculate pay, projected pay, and missing hours
function calculatePay(hoursWorked, hourlyRate, expectedHours) {
    if (isNaN(hoursWorked) || isNaN(hourlyRate)) {
        alert("Please enter valid numbers or upload a valid Excel file.");
        return;
    }

    const totalPay = hoursWorked * hourlyRate;

    let projectedPayMessage = "";
    let missingHoursMessage = "";
    if (!isNaN(expectedHours)) {
        const projectedPay = expectedHours * hourlyRate;
        const missingHours = expectedHours - hoursWorked;

        projectedPayMessage = `<br>Projected Pay (for ${expectedHours} hours): $${projectedPay.toFixed(2)}`;
        missingHoursMessage = `<br>Missing Hours: ${missingHours > 0 ? missingHours : 0}`;
    }

    document.getElementById("result").innerHTML = `
        Total Pay (actual): $${totalPay.toFixed(2)}
        ${projectedPayMessage}
        ${missingHoursMessage}
    `;
}

// Function to read Excel file and extract hours worked, hourly rate, and expected hours
function readExcelFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Assume the Excel sheet has the columns: HoursWorked, HourlyRate, ExpectedHours
        const row = jsonData[0]; // Taking the first row of the Excel as an example
        callback({
            hoursWorked: parseFloat(row.HoursWorked),
            hourlyRate: parseFloat(row.HourlyRate),
            expectedHours: parseFloat(row.ExpectedHours)
        });
    };
    reader.readAsArrayBuffer(file);
}
