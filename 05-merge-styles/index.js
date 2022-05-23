const fs = require('fs');
const path = require('path');

const fsPromises = fs.promises;
const folderInit = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

fsPromises.rm(bundle, {recursive: true, force: true}).finally(() => {
  copy();
});

function copy() {
  fs.readdir(folderInit, {withFileTypes: true}, function (err, items) {
    fs.createWriteStream(bundle);
    for (const item of items) {
      if (item.isFile() && path.extname(item.name) === '.css') {
        let css = '';
        const pathToCSS = path.join(folderInit, path.basename(item.name));
        const stream = fs.createReadStream(pathToCSS, 'utf-8');
        stream.on('data', chunk => css += chunk);
        stream.on('end', () => {
          css = `${css}

`;
          fs.appendFile(
            bundle,
            css,
            (err) => {
              if (err) throw err;
            }
          );
        });
      }
    }
  });
}
