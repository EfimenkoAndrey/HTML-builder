const fs = require('node:fs');
const path = require('node:path');

const pathDir = path.resolve(__dirname, 'styles');
const pathMy = path.resolve(__dirname, 'project-dist');
const writableStream = fs.createWriteStream(path.join(pathMy, 'bundle.css'));

fs.readdir(pathDir, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    fs.stat(path.join(pathDir, file), (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        if (path.parse(file).ext === '.css') {
          const readStream = fs.createReadStream(path.join(pathDir, file), 'utf-8');
          readStream.on('data', (chunk) => {
            writableStream.write(chunk);
          })
        }
      }
    })
  })
})
