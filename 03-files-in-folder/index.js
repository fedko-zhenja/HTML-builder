const fs = require('fs');
const path = require('path');

const pathToSecretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToSecretFolder, {withFileTypes:true}, (err, files) => {
  if (err) {
    throw err;
  } else {
    files.forEach((el) => {
      if (el.isDirectory() === false) {
        const nameAndExtention = el.name;
        const name = nameAndExtention.slice(0, nameAndExtention.indexOf('.'));
        const extension = nameAndExtention.slice(nameAndExtention.indexOf('.') + 1);

        fs.stat(path.join(pathToSecretFolder, el.name), (err, stat) => {
          const size = stat.size;
          console.log(`${name} - ${extension} - ${size}B`);        
        });
      }
    });
  }
});