const axios = require('axios');
const iconv = require('iconv-lite');

async function downloadData(url) {
    let response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
    });
    
    let decodedData = iconv.decode(Buffer.from(response.data), 'euc-kr');

    return decodedData;
}

module.exports = downloadData;