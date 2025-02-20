function generateQRCode() {
    const input = document.getElementById('qr-input').value;
    const qrCodeElement = document.getElementById('qr-code');
    const downloadBtn = document.getElementById('downloadBtn');

    qrCodeElement.innerHTML = ''; // Clear previous QR code
    downloadBtn.style.display = 'none'; // Hide download button initially

    if (input) {
        const size = document.getElementById('sizeSelector').value; // Get selected size
        const qrCodeSize = parseInt(size, 10); // Convert size to a number

        // Dynamically resize the QR code container
        qrCodeElement.style.width = `${qrCodeSize}px`;
        qrCodeElement.style.height = `${qrCodeSize}px`;

        QRCode.toCanvas(input, { width: qrCodeSize, errorCorrectionLevel: 'H' }, function (error, canvas) {
            if (error) {
                console.error(error);
                alert('Something went wrong. Please try again.');
            } else {
                // Append the canvas to the QR code container
                qrCodeElement.appendChild(canvas);

                // Show the download button
                downloadBtn.style.display = 'inline-block';

                // Set up the download button functionality
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = 'qrcode.png';
                    link.click();
                };
            }
        });
    } else {
        alert('Please enter some text or a URL to generate a QR code.');
    }
}

// Add event listener to the size selector dropdown
document.getElementById('sizeSelector').addEventListener('change', function () {
    const input = document.getElementById('qr-input').value;
    if (input) {
        generateQRCode(); // Regenerate QR code if input is not empty
    }
});