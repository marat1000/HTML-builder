const fs = require('fs');
const path = require('path');

const fsPromises = fs.promises;
const folderInit = path.join(__dirname, 'files');
const folder = `${folderInit}-copy`;

fs.promises.rm(folder, {recursive: true, force: true}).finally(() => {
  copy();
});

function copy() {
  fsPromises.mkdir(folder, {recursive: true}).then(function () {}).catch(function () {});
  fs.readdir(folderInit, {withFileTypes: true}, function (err, items) {
    for (const item of items) {
      if (item.isFile()) {
        const pathToFile = path.join(folderInit, item.name);
        const pathToFile2 = path.join(folder, item.name);
        fsPromises.copyFile(pathToFile, pathToFile2).then(function () {}).catch(function () {});
      }
    }
  });
}
