const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('next/link') || content.includes('<Link')) {
    content = content.replace(/import Link from ['"]next\/link['"];?\r?\n/g, '');
    content = content.replace(/<Link/g, '<a').replace(/<\/Link>/g, '</a>');
    
    // Replace href="/..." with href="./....html"
    // except for anchors like href="/#features" -> href="./index.html#features"
    content = content.replace(/href="\/([a-zA-Z0-9-]+)"/g, 'href="./$1.html"');
    content = content.replace(/href="\/(#[^"]+)"/g, 'href="./index.html$1"');
    content = content.replace(/href="\/"/g, 'href="./index.html"');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
