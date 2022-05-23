const fs = require('fs');
const path = require('path');
const pathFile = path.join(__dirname, 'app.txt');
const readline = require('readline');
const rl = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});
function writeContent(content) {
	if (content === 'exit') {
		process.exit()
	}
	fs.appendFile(pathFile, content+'\n', err => {
		if (err) throw err
	})
	rl.question('', writeContent);
};
rl.question('Hi, write here message!\n', writeContent);
process.on('exit', () => console.log('Goodbye!'))