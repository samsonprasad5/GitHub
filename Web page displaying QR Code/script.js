// The information you want the QR code to contain
const qrData = "https://www.example.com"; // Replace with your URL or text

// Generate the QR code
QRCode.toCanvas(qrData, { errorCorrectionLevel: 'H' }, function (error, canvas) {
    if (error) {
        console.error(error);
        alert('Something went wrong. Please try again.');
    } else {
        // Display the QR code on the webpage
        const qrCodeElement = document.getElementById('qr-code');
        qrCodeElement.appendChild(canvas);
    }
});