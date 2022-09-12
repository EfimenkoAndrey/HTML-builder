const fs = require('node:fs');
const path = require('node:path');

const pathMainDir = path.resolve(__dirname, 'project-dist');
const pathAssets = path.resolve(__dirname, 'assets');
const pathDirCss = path.resolve(__dirname, 'styles');
const writableStream = fs.createWriteStream(path.join(pathMainDir, 'style.css'));
// Асинхронная функция для создания папки
const addDir = async (path) => {
  return new Promise ((resolve, reject) => fs.mkdir(path, { recursive: true }, (err) => {
    if (err) reject(err.message);
    resolve()
  }))
}
// Асинхронная функция для копирования файлов
const copyFile = async (src, dest) => {
  return new Promise((resolve, reject) => fs.copyFile(src, dest, (err) => {
    if (err) reject(err.message);
    resolve();
  })) 
}
// Копирование папки "assets";
async function copyDir () {
  fs.readdir(pathAssets, (err, stats) => {
    if (err) throw err;
    stats.forEach(dir => {
      addDir(path.join(pathMainDir, 'assets', dir))
    })
    fs.readdir(path.join(pathMainDir, 'assets'), (err, dirs) => {
      if (err) throw err;
      dirs.forEach(dir => {
        if (stats.indexOf(dir) === -1) {
          fs.rmdir(path.join(pathMainDir, 'assets', dir), (err) => {
            if (err) throw err
          })
        }
      })
    })
  })
}
// Копирование файлов из "assets";
async function copyFiles () {
  fs.readdir(pathAssets, (err, stats) => {
    if (err) throw err;
    stats.forEach(dir => {
      fs.readdir(path.join(pathAssets, dir), (err, files) => {
        if (err) throw err;
        files.forEach(file => {
          copyFile(path.join(pathAssets, dir, file), path.join(pathMainDir, 'assets', dir, file));
        })
        fs.readdir(path.join(pathMainDir, 'assets', dir), (err, currentFiles) => {
          if (err) throw err;
          currentFiles.forEach(curFile => {
            if (files.indexOf(curFile) === -1) {
              fs.unlink(path.join(pathMainDir, 'assets', dir, curFile), (err) => {
                if (err) throw err;
              })
            }
          })
        })
      })
    })
  })
}
// Сборка style.css;
async function buildCss (src) {
  fs.readdir(src, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      fs.stat(path.join(src, file), (err, stats) => {
        if (err) throw err;
        if (stats.isFile()) {
          if (path.parse(file).ext === '.css') {
            const readStream = fs.createReadStream(path.join(src, file), 'utf-8');
            readStream.on('data', (chunk) => {
              writableStream.write(chunk);
            })
          }
        }
      })
    })
  })
}
// Создание сборки html файла
const pathFolderForHtml = path.resolve(__dirname, 'components');
const pathTemplateHtml = path.resolve(__dirname, 'template.html');

async function readAndWriteFile () {
  let content;
  let tags;
  let tagsName;
  fs.readdir(pathFolderForHtml, (err, files) => {
    if (err) throw err;
    const readFile = fs.createReadStream(pathTemplateHtml, 'utf-8');
    readFile.on('data', chunk => {
      content = chunk;
      tags = content.match(/{{\w*}}/g);
      tagsName = content.match(/{{\w*}}/g).join().replace(/[{}]/g, '').split(',');
      let i = 0;
      while (i < tagsName.length) {
        const currentTag = tags[i];
        let pathForRead = path.join(pathFolderForHtml, `${tagsName[i]}.html`);
        const read = fs.createReadStream((pathForRead), 'utf-8');
        if (files.includes(`${tagsName[i]}.html`)) {
          read.on('data', chunk => {
            content = content.replace(currentTag, chunk);
            fs.writeFile(path.join(pathMainDir, 'index.html'), content, (err) => {
              if (err) throw err;
            })
          })
        }
        i++;
      }
    })
    readFile.on('end', () => console.log('Сборка выполнена!'));
    readFile.on('error', (e) => console.log(e));
  })
}
// Последовательность запуска программы
addDir(pathMainDir)
  .then(addDir(path.join(pathMainDir, 'assets')))
  .then(copyDir())
  .then(copyFiles())
  .then(buildCss(pathDirCss))
  .then(readAndWriteFile())
  .catch(err => console.log(err))
