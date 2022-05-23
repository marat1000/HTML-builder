const fs = require('fs');
const path = require('path');

const fsPromises = fs.promises;
const initAssets = path.join(__dirname, 'assets');
const folder = path.join(__dirname, 'project-dist');
const assets = path.join(folder, 'assets');
const html = path.join(folder, 'index.html');
const style = path.join(folder, 'style.css');
const stylesInit = path.join(__dirname, 'styles');
const template = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');

fs.rm(folder, {recursive: true, force: true}, () => {
  fs.mkdir(folder, {recursive: true}, () => {
    fs.mkdir(assets, {recursive: true}, () => {
      copyAssets(assets, initAssets);
    });
    copyCSS();
    bundleHTML();
  });
});

function copyAssets(currentFolder, currentFolderInit) {
  fsPromises.mkdir(currentFolder, {recursive: true}).then(function () {}).catch(function () {});
  fs.readdir(currentFolderInit, {withFileTypes: true}, function (err, items) {
    for (const item of items) {
      if (item.isFile()) {
        const pathToFile = path.join(currentFolderInit, item.name);
        const pathToFile2 = path.join(currentFolder, item.name);
        fsPromises.copyFile(pathToFile, pathToFile2).then(function () {
        }).catch(function () {
        });
      } else {
        copyAssets(path.join(currentFolder, item.name), path.join(currentFolderInit, item.name));
      }
    }
  });
}

function copyCSS() {
  fs.readdir(stylesInit, {withFileTypes: true}, function (err, items) {
    fs.createWriteStream(style);
    let i = 0;
    while (i !== items.length && items[i].name !== 'header.css') {
      i++;
    }
    if (i !== items.length) {
      let css = '';
      const pathToCSS = path.join(stylesInit, path.basename(items[i].name));
      const stream = fs.createReadStream(pathToCSS, 'utf-8');
      stream.on('data', chunk => css += chunk.toString());
      stream.on('end', () => {
        css = `${css}
`;
        fs.appendFile(
          style,
          css,
          (err) => {
            if (err) throw err;
            for (const item of items) {
              if (item.isFile() && path.extname(item.name) === '.css' && item.name !== 'header.css') {
                let css = '';
                const pathToCSS = path.join(stylesInit, path.basename(item.name));
                const stream = fs.createReadStream(pathToCSS, 'utf-8');
                stream.on('data', chunk => css += chunk.toString());
                stream.on('end', () => {
                  css = `${css}
`;
                  fs.appendFile(
                    style,
                    css,
                    (err) => {
                      if (err) throw err;
                    }
                  );
                });
              }
            }
          }
        );
      });
    } else {
      for (const item of items) {
        if (item.isFile() && path.extname(item.name) === '.css') {
          let css = '';
          const pathToCSS = path.join(stylesInit, path.basename(item.name));
          const stream = fs.createReadStream(pathToCSS, 'utf-8');
          stream.on('data', chunk => css += chunk.toString());
          stream.on('end', () => {
            css = `${css}
`;
            fs.appendFile(
              style,
              css,
              (err) => {
                if (err) throw err;
              }
            );
          });
        }
      }
    }
  });
}

function bundleHTML() {
  fs.createWriteStream(html);
  const stream = fs.createReadStream(template, 'utf-8');
  let contentHTML = '';
  let compos = {};
  stream.on('data', chunk => contentHTML += chunk.toString());
  stream.on('end', () => {
    (async () => {
      let promise = new Promise((resolve) => {
        fs.readdir(components, {withFileTypes: true}, function (err, items) {
          let i = 0;
          for (const item of items) {
            if (item.isFile() && path.extname(item.name) === '.html') {
              const pathToFile = path.join(components, item.name);
              const stream = fs.createReadStream(pathToFile, 'utf-8');
              let content = '';
              stream.on('data', chunk => content += chunk.toString());
              stream.on('end', () => {
                const ext = path.extname(item.name);
                const name = path.basename(item.name, ext);
                compos[name] = content;
                if (i === items.length - 1) {
                  resolve(compos);
                }
                i++;
              });
            }
          }
        });
      });
      let res = await promise;
      const entries = Object.entries(res);
      for(const [key, value] of entries) {
        contentHTML = contentHTML.replace(`{{${key}}}`, value);
      }
      fs.writeFile(html, contentHTML, function (error) {
        if (error) throw error;
      });
    })();
  });
}

