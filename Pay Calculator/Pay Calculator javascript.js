const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];

document.getElementById("darkModeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    updateResultStyle();
});

function updateResultStyle() {
    const resultDiv = document.getElementById("result");
    if (document.body.classList.contains("dark-mode")) {
        resultDiv.style.backgroundColor = "#444";
        resultDiv.style.color = "white";
    } else {
        resultDiv.style.backgroundColor = "#e9ffe9";
        resultDiv.style.color = "#333";
    }
}

document.getElementById("fileUpload").addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        showErrorMessage("Error: File size exceeds 10MB.");
        return;
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        showErrorMessage("Error: Invalid file type. Only .xlsx and .csv files are allowed.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        calculateTotalAndMissingHours(sheetData);
    };
    reader.readAsArrayBuffer(file);
}

function calculateTotalAndMissingHours(data) {
    if (data.length < 1) {
        showErrorMessage("Invalid data. Please ensure the Excel file contains valid data.");
        return;
    }

    let totalHoursWorked = 0;
    let totalExpectedHours = 80;  // Default to 80 hours for fortnight if no Expected Hours column

    // Iterate through all rows and add up the numbers (assuming numbers are hours)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        row.forEach(value => {
            if (!isNaN(value) && value > 0) {
                totalHoursWorked += parseFloat(value);
            }
        });
    }

    const missingHours = Math.max(0, totalExpectedHours - totalHoursWorked);

    // Display the results
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <p>Total Hours Worked: ${totalHoursWorked.toFixed(2)} hours</p>
        <p>Total Expected Hours: ${totalExpectedHours.toFixed(2)} hours</p>
        <p>Missing Hours: ${missingHours.toFixed(2)} hours</p>
    `;

    updateResultStyle();
}

// Show error message function
function showErrorMessage(message) {
    const errorBox = document.getElementById("error-message");
    const errorText = document.getElementById("error-text");
    errorText.textContent = message;
    errorBox.style.display = 'block'; // Show error box

    setTimeout(() => {
        errorBox.style.display = 'none'; // Hide error box after 5 seconds
    }, 5000);
}
