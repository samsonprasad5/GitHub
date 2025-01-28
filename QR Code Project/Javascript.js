// script.js
function generateQRCode() {
    const input = document.getElementById('qr-input').value;
    const qrCodeElement = document.getElementById('qr-code');

    qrCodeElement.innerHTML = '';

    if (input) {
        QRCode.toCanvas(input, { errorCorrectionLevel: 'H' }, function (error, canvas) {
            if (error) {
                console.error(error);
                alert('Something went wrong. Please try again.');
            } else {
                qrCodeElement.appendChild(canvas);

                // Add download button
                const downloadButton = document.createElement('button');
                downloadButton.innerText = 'Download QR Code';
                downloadButton.onclick = () => {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = 'qrcode.png';
                    link.click();
                };
                qrCodeElement.appendChild(downloadButton);
            }
        });
    } else {
        alert('Please enter some text or a URL to generate a QR code.');
    }
}