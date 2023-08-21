const fs = require('fs');
const path = require('path');
const downloadData = require('../services/downloadService');
const editExcel = require('../services/editExcelService');
const config = require('../../config/config.js');

let allExcelData = {}; 

async function downloadExcelAndEdit(downloadConfig, index) {
    let file_extension = 'csv';

    let download_url = config.urlFront + downloadConfig.download_url + config.urlBehind;  
    let exit_text_array = downloadConfig.exit_text.split('-');  
    let exit_text_prefix = exit_text_array.slice(0, 2).join('-');  
    let exit_text = downloadConfig.exit_text; 

    let decodedData = await downloadData(download_url); 
    let newExcelData = await editExcel(decodedData, exit_text, !allExcelData[exit_text_prefix]); 

    if (!allExcelData[exit_text_prefix]) {
        allExcelData[exit_text_prefix] = newExcelData;
    } else {
        let rows = newExcelData.toString().split('\n').slice(1); 
        allExcelData[exit_text_prefix] += '\n' + rows.join('\n');
    }
}

async function writeAllDataToFile() {
    let download_path = './export/';

    if (!fs.existsSync(download_path)) {
        fs.mkdirSync(download_path, {recursive: true});
    }

    Object.keys(allExcelData).forEach(function(exit_text_prefix) {
        let file_name = exit_text_prefix + "~" + Date.now(); 
        let dest = path.join(download_path, file_name + '.' + 'csv');
        fs.writeFileSync(dest, allExcelData[exit_text_prefix]); 

        console.log(`'${file_name}' 파일이 저장되었습니다.`);
    });

    let all_file_name = 'AllData_' + Date.now();
    let all_dest = path.join(download_path, all_file_name + '.' + 'csv');
    fs.writeFileSync(all_dest, Object.values(allExcelData).join('\n')); 

    console.log(`'${all_file_name}' 통합 파일이 저장되었습니다.`);
}

module.exports = {
    downloadExcelAndEdit,
    writeAllDataToFile,
};