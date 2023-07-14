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
        for (let z in worksheet) {
            if(z[0] === '!') continue;
            let yy = parseInt(z.match(/\d+/g), 10);
            if (yy == 1) delete worksheet[z];
        }
    }

    let newWorkbook = XLSX.write(workbook, {type: 'buffer', bookType: 'csv'});
    let newExcelData = iconv.encode(newWorkbook, 'utf-8');

    return newExcelData;
}

module.exports = editExcel;