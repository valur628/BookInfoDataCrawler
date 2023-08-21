const XLSX = require('xlsx');
const iconv = require('iconv-lite');

function editExcel(decodedData, exit_text, includeHeader) {
    let workbook = XLSX.read(decodedData, {type: 'string'});
    let sheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[sheetName];
    let lastRow = XLSX.utils.decode_range(worksheet['!ref']).e.r+1;

    for(let i = 2; i <= lastRow; i++) {
        let cell = 'K' + i;
        worksheet[cell].v = exit_text;
    }

    if (!includeHeader) {
        let newRange = XLSX.utils.decode_range(worksheet['!ref']);
        if(newRange.e.r > 0){
            newRange.s.r = 1;
            worksheet['!ref'] = XLSX.utils.encode_range(newRange);
        }
    }

    edit_count++;
    console.log(`'${edit_count}'번째 수정 중입니다.`);

    let newWorkbook = XLSX.write(workbook, {type: 'buffer', bookType: 'csv'});
    let newExcelData = iconv.encode(newWorkbook, 'utf-8');

    return newExcelData;
}

module.exports = editExcel;