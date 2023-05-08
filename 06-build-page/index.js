const fs = require('fs');
const path = require('path');
// let { COPYFILE_EXCL } = fs.constants;
const prom = require('fs/promises');

const pathToTemplateFile = path.join(__dirname, 'template.html');
const pathToProjectDistFile = path.join(__dirname, 'project-dist');
const htmlFile = path.join(__dirname, 'project-dist', 'index.html');

const articlesFile = path.join(__dirname, 'components', 'articles.html');
const footerFile = path.join(__dirname, 'components', 'footer.html');
const headerFile = path.join(__dirname, 'components', 'header.html');

let aboutFile;

fs.stat(path.join(__dirname, 'components', 'about.html'), function(err) {
  if (err) {
    console.log('Здравствуйте!');
  } else {
    aboutFile = path.join(__dirname, 'components', 'about.html');
    console.log('Здравствуйте!');
  }
});

const pathToStyleFile = path.join(__dirname, 'styles');

const pathToAssetsFile = path.join(__dirname, 'assets');
const pathToCopyAssetsFile = path.join(__dirname, 'project-dist', 'assets'); 

let arrayStyles = [];

let arrayComponents = [];


async function createFolder () {
  await prom.rm(pathToProjectDistFile, { recursive: true, force: true }, err => {
    if (err) {
      throw err;
    } else {
      console.log('папка удалена');
    }
  });

  await prom.mkdir(pathToProjectDistFile, { recursive: true }, err => {
    if (err) {
      throw err;
    } else {
      console.log('папка создана');
    }
  });


  const readStream = fs.createReadStream(pathToTemplateFile, 'utf-8');

  readStream.on('data', (chunk) => {

    fs.readFile(headerFile, 'utf8', function(err, data){
      if (err) {
        throw err;
      }
      chunk = chunk.replace('{{header}}', data);
      

      fs.readFile(articlesFile, 'utf8', function(err, data){
        if (err) {
          throw err;
        }
        chunk = chunk.replace('{{articles}}', data);

        fs.readFile(footerFile, 'utf8', function(err, data){
          if (err) {
            throw err;
          }
          chunk = chunk.replace('{{footer}}', data);

          if (aboutFile !== undefined) {

            fs.readFile(aboutFile, 'utf-8', function(err, data) {
              console.log(data);
              if (err) {
                throw err;
              }
              chunk = chunk.replace('{{about}}', data);

              arrayComponents.push(chunk);
    
              fs.appendFile(
                path.join(htmlFile),
                arrayComponents.join(''),
                err => {
                  if (err) throw err;
                }
              );
            });

          } else {
            arrayComponents.push(chunk);
  
            fs.appendFile(
              path.join(htmlFile),
              arrayComponents.join(''),
              err => {
                if (err) throw err;
              }
            );
          }



        });

      });


    });
  });



  
  fs.readdir(pathToStyleFile, {withFileTypes:true}, (err, files) => {

    fs.stat(path.join(__dirname, 'project-dist', 'style.css'), function(err) {
      if (err) {
        console.log('Файл index.html создан. Файл style.css сгенерирован. Папка assets скопирована.');
      } else {
        fs.unlink(path.join(__dirname, 'project-dist', 'style.css'), (err) => {
          if (err)  throw err;
          console.log('Файл index.html создан. Файл style.css сгенерирован. Папка assets скопирована.');
        });
      }
    });
    
    fs.writeFile(
      path.join(__dirname, 'project-dist', 'style.css'),
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
              path.join(__dirname, 'project-dist', 'style.css'),
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


  await prom.rm(pathToCopyAssetsFile, { recursive: true, force: true }, err => {
    if (err) {
      throw err;
    }
  });

  await prom.mkdir(pathToCopyAssetsFile, { recursive: true }, err => {
    if (err) {
      throw err;
    }
  });

  fs.readdir(pathToAssetsFile, { withFileTypes: true }, (err, files) => {

    if (err) {
      throw err;
    } else {
      files.forEach((el) => {
        fs.mkdir(path.join(pathToCopyAssetsFile, el.name), { recursive: true }, err => {
          if (err) {
            throw err;
          }
        });

        fs.readdir(path.join(__dirname, 'assets', el.name), { withFileTypes: true }, (err, file) => {
          if (err) {
            throw err;
          } else {
            file.forEach((item) => {
                    
              fs.copyFile(path.join(pathToAssetsFile, el.name, item.name), path.join(pathToCopyAssetsFile, el.name, item.name), err => {
                if (err) {
                  throw err;
                }
              });


            });
          }
        });
      }
      );
    }
  });

}

createFolder ();