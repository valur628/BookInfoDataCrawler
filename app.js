// 모듈을 가져옵니다.
const configList = require('./config/download_config.json');
const { downloadExcelAndEdit, writeAllDataToFile } = require('./src/controllers/mainController');

// 각 설정 파일마다 다운로드 및 편집 함수를 실행합니다.
// 모든 함수의 실행이 끝나면, 모든 데이터를 하나의 파일로 작성합니다.
Promise.all(
    configList.map((config, index) => downloadExcelAndEdit(config, index))
).then(
    () => writeAllDataToFile()
).catch(console.error);