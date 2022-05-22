const fs = require('fs');
const path = require('path');
const textTxt = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(textTxt, 'utf-8');

stream.on('readable', () => {
  let data = stream.read();
  console.log(data);
  stream.destroy();
});

stream.on('error', (err) => console.error('' + err));
