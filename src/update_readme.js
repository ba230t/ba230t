const fs = require('fs');
const https = require('https');

const bingUrl = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=ja-JP';
const startMarker = '<!-- Bing Wallpaper Start -->';
const endMarker = '<!-- Bing Wallpaper End -->';

https.get(bingUrl, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const jsonData = JSON.parse(data);
    const imageTitle = `## ${jsonData.images[0].title}`;
    const imageCopyright = `${jsonData.images[0].copyright}`;
    const imageCopyrightlink = `${jsonData.images[0].copyrightlink}`;
    const imageUrl = `https://www.bing.com${jsonData.images[0].url}`;
    const imageMarkdown = `![Bing Wallpaper](${imageUrl})`;
    const imageCRMarkdown = `[${imageCopyright}](${imageCopyrightlink})`;

    fs.readFile('README.md', 'utf8', (err, readmeContent) => {
      if (err) throw err;

      // README.md内の既存のBing Wallpaper部分を置き換える
      const start = readmeContent.indexOf(startMarker);
      const end = readmeContent.indexOf(endMarker);

      let newContent;
      if (start !== -1 && end !== -1) {
        // 既存のマーカーがある場合はその間を置き換える
        newContent = `${readmeContent.substring(0, start + startMarker.length)}\n${imageTitle}\n${imageMarkdown}\n${imageCRMarkdown}\n${readmeContent.substring(end)}`;
      } else {
        // 既存のマーカーがない場合は新しく追加
        newContent = `${readmeContent}\n\n${startMarker}\n${imageTitle}\n${imageMarkdown}\n${imageCRMarkdown}\n${endMarker}\n`;
      }

      fs.writeFile('README.md', newContent, (err) => {
        if (err) throw err;
        console.log('README.md has been updated!');
      });
    });
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
