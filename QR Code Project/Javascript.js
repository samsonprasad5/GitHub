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
                // Resize the canvas to make the QR code larger
                const scaleFactor = 2; // Increase this to make the QR code bigger
                const scaledWidth = canvas.width * scaleFactor;
                const scaledHeight = canvas.height * scaleFactor;

                // Create a new canvas with the desired size
                const scaledCanvas = document.createElement('canvas');
                scaledCanvas.width = scaledWidth;
                scaledCanvas.height = scaledHeight;

                // Draw the original canvas onto the new, larger canvas
                const ctx = scaledCanvas.getContext('2d');
                ctx.imageSmoothingEnabled = false; // Keep the QR code sharp
                ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);

                // Append the scaled canvas to the DOM
                qrCodeElement.appendChild(scaledCanvas);

                // Add download button
                const downloadButton = document.createElement('button');
                downloadButton.innerText = 'Download QR Code';
                downloadButton.onclick = () => {
                    const link = document.createElement('a');
                    link.href = scaledCanvas.toDataURL('image/png');
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