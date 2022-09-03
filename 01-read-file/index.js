const fs = require('node:fs');
const path = require('node:path');

const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');

stream.on('data', (chunk) => {
  console.log(chunk);
})
stream.on('open', () => console.log('Начали читать!'));
stream.on('end', () => console.log('Закончили читать!'));
stream.on('error', (err) => console.log(err));

