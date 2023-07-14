const configList = require('./config/download_config.json');
const { downloadExcelAndEdit, writeAllDataToFile } = require('./src/controllers/mainController');

// Promise chain을 초기화합니다.
// 체인에 각 Excel 다운로드가 연결되며, 연속적인 작업을 실행하게 됩니다.
// 초기값은 resolved 상태인 Promise 객체입니다.
let chain = Promise.resolve();

// 각 설정 파일마다 다운로드 및 편집 함수를 실행합니다.
// forEach 대신으로 map을 사용하지 않았습니다.
// 때문에, 배열의 각 요소에 대해 새 Promise가 chain에 추가되는 대신 이전 Promise의 결과에 따라 추가됩니다.
configList.forEach((config, index) => {
  chain = chain
    // 각 요청 이후 5초를 기다립니다.
    // setTimeout에 의해 반환된 Promise가 resolve되는 콜백 함수는 인자로 전달됩니다.
    // 그리고 이 콜백 함수가 실행될 때까지 기다립니다.
    .then(() => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1500) + 500)))
    .then(() => downloadExcelAndEdit(config, index));

    // setTimeout(resolve, 시간 정수)
    // 시간 정수에 1000은 1초를 뜻하는 딜레이 시간입니다.
    // 서버에 과도한 부하를 주지 않으면서 요청을 반복적으로 보내는 데 도움이 됩니다.
});

// 모든 함수의 실행이 끝나고 나면, 마지막으로 모든 데이터를 통합하여 한 파일로 작성합니다.
// 마지막으로 catch로 연결하여 에러가 발생했을 때 이를 콘솔에 표시하도록 합니다.
chain
  .then(() => writeAllDataToFile())
  .catch(console.error);