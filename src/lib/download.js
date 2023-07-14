const axios = require('axios');
const iconv = require('iconv-lite');

async function downloadData(url) {
    let response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
    });
    
    // 받아온 데이터의 인코딩을 iconv-lite를 이용해서 'euc-kr'에서 'utf-8'로 변환합니다.
    let decodedData = iconv.decode(Buffer.from(response.data), 'euc-kr');

    return decodedData;
}

module.exports = downloadData;