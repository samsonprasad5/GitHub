function calculatePay() {
    let hours = parseFloat(document.getElementById('hours').value);
    let rate = parseFloat(document.getElementById('rate').value);
    let tax = parseFloat(document.getElementById('tax').value);
    let requiredHours = parseFloat(document.getElementById('requiredHours').value);

    fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours: hours, rate: rate, tax: tax, required_hours: requiredHours })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('grossPay').innerText = "Gross Pay: $" + data.gross_pay;
        document.getElementById('netPay').innerText = "Net Pay: $" + data.net_pay;
        document.getElementById('missingHours').innerText = data.missing_hours > 0 ? "Missing Hours: " + data.missing_hours : "No missing hours";
    })
    .catch(error => console.error('Error:', error));
}
