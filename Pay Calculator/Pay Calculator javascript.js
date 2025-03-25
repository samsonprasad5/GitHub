document.getElementById("calculatorForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page refresh

    // Get input values
    const hoursWorked = parseFloat(document.getElementById("hoursWorked").value);
    const hourlyRate = parseFloat(document.getElementById("hourlyRate").value);
    const expectedHours = parseFloat(document.getElementById("expectedHours").value);

    // Validate hours worked and hourly rate
    if (isNaN(hoursWorked) || isNaN(hourlyRate)) {
        alert("Please enter valid numbers for hours worked and hourly rate.");
        return;
    }

    // Calculate total pay
    const totalPay = hoursWorked * hourlyRate;

    // Calculate and display missing hours and projected pay if expected hours are provided
    let projectedPayMessage = "";
    let missingHoursMessage = "";
    if (!isNaN(expectedHours)) {
        const projectedPay = expectedHours * hourlyRate;
        const missingHours = expectedHours - hoursWorked;

        projectedPayMessage = `<br>Projected Pay (for ${expectedHours} hours): $${projectedPay.toFixed(2)}`;
        missingHoursMessage = `<br>Missing Hours: ${missingHours > 0 ? missingHours : 0}`;
    }

    // Update the result div to display total pay, projected pay, and missing hours
    document.getElementById("result").innerHTML = `
        Total Pay (actual): $${totalPay.toFixed(2)}
        ${projectedPayMessage}
        ${missingHoursMessage}
    `;
});
