// Toggle dark mode on body and inputs/buttons
document.getElementById("darkModeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");
});

function handleSubmit() {
    let hoursWorked = parseFloat(document.getElementById("hoursWorked").value);
    let hourlyRate = parseFloat(document.getElementById("hourlyRate").value);
    let expectedHours = parseFloat(document.getElementById("expectedHours").value);

    const fileInput = document.getElementById("fileUpload");
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        readExcelFile(file, function (data) {
            hoursWorked = data.hoursWorked || hoursWorked;
            hourlyRate = data.hourlyRate || hourlyRate;
            expectedHours = data.expectedHours || expectedHours;

            calculatePay(hoursWorked, hourlyRate, expectedHours);
        });
    } else {
        calculatePay(hoursWorked, hourlyRate, expectedHours);
    }
}

function readExcelFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length > 0) {
            const row = jsonData[0];
            const hoursWorked = parseFloat(row[0]);
            const hourlyRate = parseFloat(row[1]);
            const expectedHours = parseFloat(row[2]);

            callback({
                hoursWorked: isNaN(hoursWorked) ? 0 : hoursWorked,
                hourlyRate: isNaN(hourlyRate) ? 0 : hourlyRate,
                expectedHours: isNaN(expectedHours) ? 0 : expectedHours
            });
        } else {
            callback({});
        }
    };
    reader.readAsArrayBuffer(file);
}

function calculatePay(hoursWorked, hourlyRate, expectedHours) {
    const totalPay = hoursWorked * hourlyRate;
    let projectedPayMessage = "";
    let missingHoursMessage = "";

    if (!isNaN(expectedHours)) {
        const projectedPay = expectedHours * hourlyRate;
        const missingHours = expectedHours - hoursWorked;

        projectedPayMessage = `<br>Projected Pay (for ${expectedHours} hours): $${projectedPay.toFixed(2)}`;
        missingHoursMessage = `<br>Missing Hours: ${missingHours > 0 ? missingHours : 0}`;
    }

    document.getElementById("result").innerHTML = `Total Pay (actual): $${totalPay.toFixed(2)}${projectedPayMessage}${missingHoursMessage}`;
}
