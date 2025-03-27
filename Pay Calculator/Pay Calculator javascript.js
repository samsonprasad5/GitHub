document.getElementById("darkModeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    updateResultStyle();
});

function updateResultStyle() {
    const resultDiv = document.getElementById("result");
    if (document.body.classList.contains("dark-mode")) {
        resultDiv.style.backgroundColor = "#444";  // Dark mode background
        resultDiv.style.color = "white";  // Light text for visibility
    } else {
        resultDiv.style.backgroundColor = "#e9ffe9";  // Light mode background
        resultDiv.style.color = "#333";  // Dark text for visibility
    }
}

document.getElementById("calculateButton").addEventListener("click", function (event) {
    event.preventDefault();  // Prevent page refresh when the form submits

    const hoursWorked = parseFloat(document.getElementById("hoursWorked").value);
    const expectedHours = parseFloat(document.getElementById("expectedHours").value);

    if (isNaN(hoursWorked) || isNaN(expectedHours)) {
        alert("Please enter valid numbers.");
        return;
    }

    const hourlyRate = 20;  // Assuming $20/hour
    const totalPay = Math.max(0, hoursWorked * hourlyRate);  // Calculate total pay
    const missingHours = Math.max(0, expectedHours - hoursWorked);  // Calculate missing hours

    const resultDiv = document.getElementById("result");

    resultDiv.innerHTML = `
        <p>Total Pay: $${totalPay.toFixed(2)}</p>
        <p>Missing Hours: ${missingHours}</p>
    `;

    updateResultStyle();  // Apply the correct mode styling after calculation
});

// Handle Excel Upload and Calculate Total Hours Worked
document.getElementById("fileUpload").addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

            calculateTotalHours(sheetData);  // Calculate total hours from the sheet data
        };
        reader.readAsArrayBuffer(file);
    }
}

function calculateTotalHours(data) {
    if (data.length < 2) {
        alert("Invalid data. Please ensure the Excel file has at least one column with numeric data.");
        return;
    }

    let totalHours = 0;
    let numericColumnFound = false;

    // Iterate through each column in each row, looking for numeric values to sum
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        for (let j = 0; j < row.length; j++) {
            const value = parseFloat(row[j]);
            if (!isNaN(value)) {
                totalHours += value;
                numericColumnFound = true;
            }
        }
    }

    if (!numericColumnFound) {
        alert("No numeric data found in the file. Please upload a file with numeric values representing hours.");
        return;
    }

    // Display the total hours worked
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <p>Total Hours Worked: ${totalHours.toFixed(2)} hours</p>
    `;

    updateResultStyle();  // Apply the correct mode styling after calculation
}
