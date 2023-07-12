// 필요한 모듈들을 불러옵니다.
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const XLSX = require('xlsx');
const iconv = require('iconv-lite');
const config = require('./config/download_config.json');

async function downloadExcelAndEdit() {
    let file_extension = 'csv';

    let download_url = config.download_url;
    let exit_text = config.exit_text;
    let file_name = exit_text + "~1";
    let download_path = './export/';

    // 엑셀 파일 다운로드 시간을 측정하기 위해 타이머를 시작합니다.
    console.time('Download Excel');
    // Axios를 이용해서 엑셀 파일을 다운로드 받습니다.
    let response = await axios({
        url: download_url,
        method: 'GET',
        responseType: 'arraybuffer' 
    });
    // 다운로드 시간 측정을 마칩니다.
    console.timeEnd('Download Excel');

    // 받아온 엑셀 파일의 인코딩을 iconv-lite를 이용해서 'euc-kr'에서 'utf-8'로 변환합니다.
    let decodedData = iconv.decode(Buffer.from(response.data), 'euc-kr');
    
    // 변환된 데이터를 xlsx 라이브러리를 이용해서 엑셀 형태로 파싱합니다.
    let workbook = XLSX.read(decodedData, { type: 'string'});

    // 첫번째 시트를 가져옵니다.
    let sheetName = workbook.SheetNames[0]; 
    let worksheet = workbook.Sheets[sheetName]; 

    // 엑셀 편집 시간을 측정하기 위해 타이머를 시작합니다.
    console.time('Edit Excel');
    // K열의 내용을 수정합니다.
    let lastRow = XLSX.utils.decode_range(worksheet['!ref']).e.r + 1
    for (let i = 2; i <= lastRow; i++) {
        let cell = 'K' + i;
        worksheet[cell].v = exit_text;
    }
    // 편집 시간 측정을 마칩니다.
    console.timeEnd('Edit Excel');

    // 수정된 데이터를 다시 엑셀 파일로 변환합니다.
    let newExcelData = XLSX.write(workbook, { type: 'buffer', bookType: file_extension });

    // 생성할 엑셀 파일의 위치를 지정합니다.
    // 해당 위치에 폴더가 없으면 생성합니다.
    if (!fs.existsSync(download_path)) {
        fs.mkdirSync(download_path, { recursive: true });
    }
    let dest = path.join(download_path, file_name + '.' + file_extension);

    // 실제로 엑셀 파일을 생성하여 그 위치에 저장합니다.
    fs.writeFileSync(dest, newExcelData);

    // 완료 메시지를 출력합니다.
    console.log('엑셀 파일 수정 및 다운로드 완료');
}

// 함수를 실행합니다. 에러가 발생하면 콘솔에 출력합니다.
downloadExcelAndEdit().catch(console.error);