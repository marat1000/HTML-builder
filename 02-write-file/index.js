const fs = require('fs');
const path = require('path');
const readLine = require('readline');
const textTxt = path.join(__dirname, 'text.txt');

fs.createWriteStream(textTxt);
console.log('Приветствую! Пожалуйста, введите текст:');

const consoleReader = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

consoleReader.on('line', (data) => {
  if (data.toString() === 'exit') {
    goodbye();
  } else {
    fs.appendFile(
      textTxt,
      data.toString(),
      (err) => {
        if (err) throw err;
      }
    );
  }
});

consoleReader.on('SIGINT', () => {
  goodbye();
});

function goodbye() {
  console.log('Прощевайте!');
  consoleReader.close();
}
