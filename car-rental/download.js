const fs = require('fs');
const https = require('https');

const url = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Porsche_logo.svg/512px-Porsche_logo.svg.png";
const dest = "src/assets/porsche.png";

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
    const file = fs.createWriteStream(dest);
    response.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('Download complete');
    });
}).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error('Error downloading:', err.message);
});
