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
    } else {
      if (file.endsWith('.css')) results.push(file);
    }
  });
  return results;
}

const cssFiles = walk(path.join(__dirname, 'src'));
let changes = 0;

cssFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('font-family:')) {
    content = content.replace(/font-family:\s*[^;]+;/g, "font-family: 'Google Sans', 'Roboto', sans-serif;");
    fs.writeFileSync(file, content, 'utf8');
    changes++;
  }
});

console.log(`Updated ${changes} CSS files to use Google Sans and Roboto.`);
