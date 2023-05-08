const fs = require('fs');
const path = require('path');

const pathToStyleFile = path.join(__dirname, 'styles');

let arrayStyles = [];

async function addStyles () {

  fs.readdir(pathToStyleFile, {withFileTypes:true}, (err, files) => {

    fs.stat(path.join(__dirname, 'project-dist', 'bundle.css'), function(err) {
      if (err) {
        console.log('Привет! Файл bundle.css сгенерирован.');
      } else {
        fs.unlink(path.join(__dirname, 'project-dist', 'bundle.css'), (err) => {
          if (err)  throw err;
          console.log('Привет! Файл bundle.css сгенерирован.');
        });
      }
    });
    
    fs.writeFile(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      '',
      (err) => {
        if (err) throw err;
      });
    
    if (err) {
      throw err;
    } else {
      files.forEach((el) => {
        const nameAndExtention = el.name;
        const extension = nameAndExtention.slice(nameAndExtention.indexOf('.') + 1);
    
        if (el.isDirectory() === false && extension === 'css') {
          fs.readFile(path.join(__dirname, 'styles', el.name), 'utf8', function(error, fileContent){
            if(error) throw error;
            arrayStyles.push(fileContent);
    
            fs.appendFile(
              path.join(__dirname, 'project-dist', 'bundle.css'),
              arrayStyles.join(''),
              err => {
                if (err) throw err;
              }
            );
            arrayStyles = [];
          });
        }
      }
      );
    }
  });

}

addStyles ();
