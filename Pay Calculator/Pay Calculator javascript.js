document.getElementById("calculatorForm").addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Form submitted!");

    let hoursWorked = parseFloat(document.getElementById("hoursWorked").value);
    let hourlyRate = parseFloat(document.getElementById("hourlyRate").value);
    let expectedHours = parseFloat(document.getElementById("expectedHours").value);

    console.log("Manual input values:", { hoursWorked, hourlyRate, expectedHours });

    const fileInput = document.getElementById("fileUpload");
    if (fileInput.files.length > 0) {
        console.log("File detected. Reading Excel file...");
        const file = fileInput.files[0];

        readExcelFile(file, function (data) {
            console.log("Data extracted from Excel file:", data);

            hoursWorked = data.hoursWorked || hoursWorked;
            hourlyRate = data.hourlyRate || hourlyRate;
            expectedHours = data.expectedHours || expectedHours;

            console.log("Final values after file upload:", { hoursWorked, hourlyRate, expectedHours });

            calculatePay(hoursWorked, hourlyRate, expectedHours);
        });
    } else {
        console.log("No file uploaded. Using manual input for calculation.");
        calculatePay(hoursWorked, hourlyRate, expectedHours);
    }
});

function readExcelFile(file, callback) {
    console.log("Starting to read the Excel file...");
    const reader = new FileReader();
    reader.onload = function (event) {
        console.log("Excel file read. Parsing...");
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        console.log("Parsed Excel Sheet Data:", jsonData);

        if (jsonData.length > 0) {
            const row = jsonData[0]; // Using first row of the Excel file
            callback({
                hoursWorked: parseFloat(row.HoursWorked),
                hourlyRate: parseFloat(row.HourlyRate),
                expectedHours: parseFloat(row.ExpectedHours)
            });
        } else {
            alert("Excel file is empty or not properly formatted.");
            callback({});
        }
    };
    reader.readAsArrayBuffer(file);
}

function calculatePay(hoursWorked, hourlyRate, expectedHours) {
    console.log("Calculating pay with values:", { hoursWorked, hourlyRate, expectedHours });
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
