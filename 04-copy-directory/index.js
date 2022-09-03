const fs = require('node:fs');
const path = require('node:path');
const dirPath = path.resolve(__dirname, 'files-copy');
const dirCopy = path.resolve(__dirname, 'files');

function copyDir () {
  fs.mkdir(path.resolve(__dirname, 'files-copy'), {recursive: true}, (err) => {
    if (err) throw err
  })
  fs.readdir(dirCopy, (err, files) => {
    if (err) throw err
     files.forEach(element => {
        fs.readdir(dirPath, (err, file) => {
          if (err) throw err
          file.forEach(a => {
            if (files.indexOf(a) === -1) {
              fs.unlink(path.join(dirPath, a), () => {
                if (err) throw err
              })
            }
          })
        })
        fs.copyFile(path.join(dirCopy, element), path.join(dirPath, element), (err) => {
          if (err) throw err;
        })
      })
  })
}
copyDir()
