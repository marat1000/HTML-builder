const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');

fs.readdir(folder, {withFileTypes: true}, function (err, items) {
  for (const item of items) {
    if (item.isFile()) {
      const ext = path.extname(item.name);
      const extShort = ext.slice(1);
      const pathToFile = folder + '\\' + item.name;
      const name = path.basename(item.name, ext);
      fs.stat(pathToFile, function(err, stats) {
        console.log(`${name} - ${extShort} - ${stats.size}`);
      });
    }
  }
});
