const fs = require('fs');
const path = require('path');
const downloadData = require('../services/downloadService');
const editExcel = require('../services/editExcelService');

let allExcelData = [];

async function downloadExcelAndEdit(config, index) {
    let file_extension = 'csv';
    
    let download_url = config.download_url;
    let exit_text = config.exit_text;
    let file_name = exit_text + "~" + Date.now();
    let download_path = './export/';

    let decodedData = await downloadData(download_url);
    
    let newExcelData = await editExcel(decodedData, exit_text, index === 0); // 첫 번째 파일이면 헤더를 포함
    allExcelData.push(newExcelData);
    
    if (!fs.existsSync(download_path)) {
        fs.mkdirSync(download_path, {recursive: true});
    }
    let dest = path.join(download_path, file_name + '.' + file_extension);

    fs.writeFileSync(dest, newExcelData); 

    console.log(`'${file_name}' 파일이 저장되었습니다.`);
}

async function writeAllDataToFile() {
    let file_name = 'AllData_' + Date.now();
    let download_path = './export/';
    let dest = path.join(download_path, file_name + '.csv');

    // 인코딩을 지정하지 않습니다.
    fs.writeFileSync(dest, Buffer.concat(allExcelData));  

    console.log(`'${file_name}' 통합 파일이 저장되었습니다.`);
}

module.exports = {
    downloadExcelAndEdit,
    writeAllDataToFile,
};