const fs = require('fs');
const path = require('path');
const downloadData = require('../lib/download');
const editExcel = require('../lib/editExcel');

async function downloadExcelAndEdit(config) {
    let file_extension = 'csv';
    
    let download_url = config.download_url;
    let exit_text = config.exit_text;
    let file_name = exit_text + "~" + Date.now();
    let download_path = './export/';

    let decodedData = await downloadData(download_url);

    let newExcelData = editExcel(decodedData, exit_text);

    if (!fs.existsSync(download_path)) {
        fs.mkdirSync(download_path, {recursive: true});
    }
    let dest = path.join(download_path, file_name + '.' + file_extension);

    fs.writeFileSync(dest, newExcelData);

    console.log(`'${file_name}' 파일이 저장되었습니다.`);
}

module.exports = {
    downloadExcelAndEdit,
};