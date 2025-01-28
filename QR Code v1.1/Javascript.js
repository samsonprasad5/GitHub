function generateQRCode() {
    const inputText = document.getElementById('input-text').value;
    const qrCodeContainer = document.getElementById('qr-code-container');

    // Clear previous QR code
    qrCodeContainer.innerHTML = ''; 

    // Create a new QR code element
    const qr = qrcode(inputText, {
        render: 'canvas', 
        width: 200, 
        height: 200, 
    });

    // Append the QR code to the container
    qrCodeContainer.appendChild(qr);
}