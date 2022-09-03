const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function writable (text) {
  if (text === 'exit') {
    process.exit();
  }
  fs.appendFile(path.resolve(__dirname, 'app.txt'), text + '\n', (err) => {
    if (err) {
      throw err
    }
  })
  rl.question('', writable);
}
rl.question("Hi, let's write something! \n", writable);
process.on('exit', () => console.log('Goodbuy!'))