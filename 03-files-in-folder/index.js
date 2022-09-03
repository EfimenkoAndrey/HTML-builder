const fs = require('node:fs');
const path = require('node:path');
fs.readdir(path.resolve(__dirname, 'secret-folder'), (err, files) => {
  if (err) {
    throw err
  }
  files.forEach(element => {
    fs.stat(path.join(path.resolve(__dirname, 'secret-folder'), element), (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        console.log(`${path.parse(element).name}-${path.parse(element).ext.replace(/./, "")}-${(stats.size / 1024).toFixed(1)}kb`);
      }
    })
  })
})