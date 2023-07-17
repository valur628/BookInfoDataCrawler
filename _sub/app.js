const cheerio = require('cheerio');
const fs = require('fs');

// 파일 읽기
// UTF-8 파일이어야 함.
fs.readFile('import.txt', (err, data) => {
  if(err) throw err;  // 에러 던지기
  let output = [];  // 출력 배열 초기화
  const $ = cheerio.load(data);  // 체리오로 데이터 로드
  let current_category = "";  // 현재 카테고리 저장 변수 초기화

   // 각 li태그에 대해 함수 실행
  $('li').each((index, el) => {
    // 만약 현재 li태그가 베스트셀러 이며, ul태그를 자식으로 가진다면
    const isParent = $(el).children('a[href*="bestseller"]').length && $(el).children('ul').length;
    // 만약 현재 li태그가 'dpth2'라는 클래스를 가진 ul태그의 자식이라면
    const isChild = $(el).parents('ul').hasClass("dpth2");

    // 만약 isParent가 참이라면(현재 li태그가 베스트셀러이며 ul태그를 가진다면)
    if(isParent) {
      current_category = $(el).find('a').first().text().trim(); // 첫번째 a태그의 텍스트를 현재 카테고리로 저장
    }

    // 만약 isChild가 참이라면(현재 li태그가 'dpth2'라는 클래스를 가진 ul태그의 자식이라면)
    if(isChild) {
      // a태그를 찾고, 해당 주소를 분석하여 CategoryNumber 값을 가져옴
      const aTag = $(el).find('a[href*="bestseller"]');
      const download_url = new URL(aTag.attr('href')).searchParams.get('CategoryNumber');

      // a태그의 텍스트(하위 카테고리)를 가져와 exit_text 로 지정
      const exit_text = aTag.text().trim();

      // 최종적으로 current_category 와 exit_text 로 이루어진 객체를 여러 개 생성하여 배열 output에 추가
      output.push({
        "download_url": download_url,
        "exit_text": "국내도서-" + current_category + "-" + exit_text
      });
    }
  });
  // 최종 결과를 'output.json' 파일로 저장
  fs.writeFile('output.json', JSON.stringify(output,null,4), (err) => {
    if(err) throw err;  // 오류 던지기
    console.log("파일이 저장되었습니다.");  // 성공 메시지 출력
  });
});