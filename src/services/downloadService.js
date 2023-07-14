// 필요한 모듈들을 가져옵니다.
const axios = require('axios');
const iconv = require('iconv-lite');

// 주어진 URL에서 데이터를 다운로드하는 비동기 함수입니다.
async function downloadData(url) {
    // URL에서 데이터를 GET 방식으로 요청합니다.
    let response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
    });

    // 데이터의 인코딩을 'euc-kr'에서 'utf-8'로 변환합니다.
    let decodedData = iconv.decode(Buffer.from(response.data), 'euc-kr');

    // 변환된 데이터를 반환합니다.
    return decodedData;
}

module.exports = downloadData;