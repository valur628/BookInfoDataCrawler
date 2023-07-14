// 필요한 모듈들을 가져옵니다.
const fs = require('fs');
const path = require('path');
const downloadData = require('../services/downloadService');
const editExcel = require('../services/editExcelService');

let allExcelData = []; // 이 변수에는 모든 수정된 엑셀 데이터의 array buffer가 저장됩니다.

// 비동기 함수 downloadExcelAndEdit는 주어진 설정에 따라 엑셀 파일을 다운로드하고 편집합니다.
async function downloadExcelAndEdit(config, index) {
    let file_extension = 'csv';
    
    let download_url = config.download_url;  // json 객체에서 다운로드 URL을 분리합니다.
    let exit_text = config.exit_text;  // json 객체에서 수정할 데이터를 분리합니다.
    let file_name = exit_text + "~" + Date.now();  // 파일명은 "수정할 데이터~현재 시간"으로 설정합니다.
    let download_path = './export/';  // 파일이 저장될 디렉터리를 설정합니다.

    let decodedData = await downloadData(download_url);  // URL에서 csv 데이터를 다운로드하고 디코딩합니다.
    
    let newExcelData = await editExcel(decodedData, exit_text, index === 0);  // 첫 번째 행이면 헤더를 포함시킵니다.

    allExcelData.push(newExcelData); // 바이너리 데이터를 allExcelData 배열에 push합니다.
    
    // 파일이 저장될 디렉터리가 존재하지 않으면 생성합니다.
    if (!fs.existsSync(download_path)) {
        fs.mkdirSync(download_path, {recursive: true});
    }
    let dest = path.join(download_path, file_name + '.' + file_extension);

    // 수정한 csv 데이터를 파일로 저장합니다.
    fs.writeFileSync(dest, newExcelData); 

    console.log(`'${file_name}' 파일이 저장되었습니다.`);
}

// 비동기 함수 writeAllDataToFile는 모든 csv 데이터를 하나의 파일에 작성합니다.
async function writeAllDataToFile() {
    let file_name = 'AllData_' + Date.now();
    let download_path = './export/';
    let dest = path.join(download_path, file_name + '.csv');

    // 모든 csv 데이터를 하나의 파일에 작성합니다.
    // 인코딩을 지정하지 않습니다.
    fs.writeFileSync(dest, Buffer.concat(allExcelData)); 

    console.log(`'${file_name}' 통합 파일이 저장되었습니다.`);
}

module.exports = {
    downloadExcelAndEdit,
    writeAllDataToFile,
};