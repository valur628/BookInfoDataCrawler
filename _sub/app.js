const cheerio = require('cheerio');
const fs = require('fs');

fs.readFile('import.txt', (err, data)=>{
 if(err) throw err;
 let output = [];
 const $ = cheerio.load(data);
 let current_category = "";

  $('li').each((index, el)=>{
    const isParent = $(el).children('a[href*="bestseller"]').length && $(el).children('ul').length;
    const isChild = $(el).parents('ul').hasClass("dpth2");
    
    if(isParent){
      current_category = $(el).find('a').first().text().trim();
    }

    if(isChild){
      const aTag = $(el).find('a[href*="bestseller"]');
      const download_url = new URL(aTag.attr('href')).searchParams.get('CategoryNumber');
      const exit_text = aTag.text().trim();
      output.push({
        "download_url": download_url,
        "exit_text": "국내도서-" + current_category + "-" + exit_text
      });
    }
  });

 fs.writeFile('output.json', JSON.stringify(output,null,4), (err)=>{
   if(err) throw err;
   console.log("The file was saved!");
 });
});