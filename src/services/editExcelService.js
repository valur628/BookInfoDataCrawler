const XLSX = require('xlsx');
const iconv = require('iconv-lite');

// 함수 editExcel은 csv 데이터를 받아 내용을 수정한 후 다시 csv 형태로 반환합니다.
function editExcel(decodedData, exit_text, includeHeader) {
    // csv 데이터를 XLSX 데이터로 변환합니다.
    let workbook = XLSX.read(decodedData, {type: 'string'});

    // 첫 번째 sheet의 이름을 얻습니다.
    let sheetName = workbook.SheetNames[0];

    // 첫 번째 sheet를 얻습니다.
    let worksheet = workbook.Sheets[sheetName];

    // 마지막 행의 번호를 얻습니다.
    let lastRow = XLSX.utils.decode_range(worksheet['!ref']).e.r+1;
    
    // 두 번째 행부터 마지막 행까지 각 행의 'K'열을 exit_text로 수정합니다.
    for(let i = 2; i <= lastRow; i++) {
        let cell = 'K' + i;
        worksheet[cell].v = exit_text;
    }

    // 첫 번째 행이 아니라면 헤더를 삭제합니다.
    if (!includeHeader) {
        for (let z in worksheet) {
            if(z[0] === '!') continue;
            let yy = parseInt(z.match(/\d+/g), 10);
            if (yy == 1) delete worksheet[z];
        }
    }

    // 수정된 XLSX 데이터를 다시 csv 데이터로 변환합니다.
    let newWorkbook = XLSX.write(workbook, {type: 'buffer', bookType: 'csv'});

    // csv 데이터의 인코딩을 'utf-8'로 변환합니다.
    let newExcelData = iconv.encode(newWorkbook, 'utf-8');

    // 변환된 데이터를 반환합니다.
    return newExcelData;
}

module.exports = editExcel;