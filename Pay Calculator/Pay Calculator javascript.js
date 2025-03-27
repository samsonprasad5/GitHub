const FIXED_HOURS_FORTNIGHTLY = 80;  // Fixed hours for fortnight (default)

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
    if (file) {
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
}

function calculateTotalAndMissingHours(data) {
    if (data.length < 1) {
        alert("Invalid data. Please ensure the Excel file contains valid data.");
        return;
    }

    let totalHoursWorked = 0;
    let totalExpectedHours = FIXED_HOURS_FORTNIGHTLY;  // Default to 80 hours for fortnight if no Expected Hours column

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
