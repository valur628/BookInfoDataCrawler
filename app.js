const configList = require('./config/download_config.json');
const { downloadExcelAndEdit, writeAllDataToFile } = require('./src/controllers/mainController');
global.edit_count = 0;

let chain = Promise.resolve();

configList.forEach((downloadConfig, index) => {
  chain = chain
    .then(() => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1500) + 750)))
    .then(() => downloadExcelAndEdit(downloadConfig, index));
});

chain
  .then(() => writeAllDataToFile())
  .catch(console.error);