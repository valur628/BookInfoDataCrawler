const XLSX = require('xlsx');

function editExcel(decodedData, exit_text) {
    let workbook = XLSX.read(decodedData, {type: 'string'});

    let sheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[sheetName];

    let lastRow = XLSX.utils.decode_range(worksheet['!ref']).e.r + 1;
    for(let i = 2; i <= lastRow; i++) {
        let cell = 'K' + i;
        worksheet[cell].v = exit_text;
    }

    let newExcelData = XLSX.write(workbook, {type: 'buffer', bookType: 'csv'});
    
    return newExcelData;
}

module.exports = editExcel;
