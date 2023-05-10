const fs = require('fs');
const path = require('path');

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  (err) => {
    if (err) throw err;
  });

const { stdin, stdout, exit } = process;

stdout.write('Введите текст\n');
stdin.on('data', data => {
  const text = data.toString().trim();

  if (text === 'exit') {
    exit();
  } else {
    fs.appendFile(
      path.join(__dirname, 'text.txt'),
      data,
      err => {
        if (err) throw err;
      }
    );
  }
});

process.on('SIGINT', () => process.exit());

process.on('exit', () => stdout.write('Удачи!'));
process.on('SIGINT', () => stdout.write('Удачи!'));
