const configList = require('./config/download_config.json');
const { downloadExcelAndEdit } = require('./src/controllers/mainController');

configList.forEach(config => {
    downloadExcelAndEdit(config).catch(console.error);
});