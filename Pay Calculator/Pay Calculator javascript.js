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

document.getElementById("calculateButton").addEventListener("click", function () {
    const hoursWorked = parseFloat(document.getElementById("hoursWorked").value);
    const expectedHours = parseFloat(document.getElementById("expectedHours").value);

    if (isNaN(hoursWorked) || isNaN(expectedHours)) {
        alert("Please enter valid numbers.");
        return;
    }

    const totalPay = hoursWorked * 20; // Assuming $20/hour as default
    const missingHours = Math.max(0, expectedHours - hoursWorked);
    const resultDiv = document.getElementById("result");

    resultDiv.innerHTML = `
        <p>Total Pay: $${totalPay.toFixed(2)}</p>
        <p>Missing Hours: ${missingHours}</p>
    `;

    updateResultStyle();  // Apply the correct mode styling after calculation
});
