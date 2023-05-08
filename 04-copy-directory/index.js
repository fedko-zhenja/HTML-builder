const fs = require('fs');
const path = require('path');
// let { COPYFILE_EXCL } = fs.constants;
const prom = require('fs/promises');

const pathToFile = path.join(__dirname, 'files');
const pathToCopyFile = path.join(__dirname, 'files-copy'); 

async function copyFile () {
  await prom.rm(pathToCopyFile, { recursive: true, force: true }, err => {
    if (err) {
      throw err;
    }
  });

  await prom.mkdir(pathToCopyFile, { recursive: true }, err => {
    if (err) {
      throw err;
    }
  });

  fs.readdir(pathToFile, {withFileTypes:true}, (err, files) => {

    if (err) {
      throw err;
    } else {
      files.forEach((el) => {
        fs.copyFile(path.join(pathToFile, el.name), path.join(pathToCopyFile, el.name), err => {
          if (err) {
            throw err;
          }
        });
      }
      );
    }
  });
}

copyFile();