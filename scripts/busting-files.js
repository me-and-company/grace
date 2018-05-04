const fs = require('fs');
const md5 = require('MD5');

const cssPath = './dist/css';
const htmlPath = './dist';

let htmlFiles;
let cssFiles;


const getHTMLfiles = function() {
  const htmlFiles = [];

  return new Promise((resolve, reject) => {
    let i = 0;
    fs.readdir(htmlPath, function(err, files) {
      files.forEach((file, index) => {
        const extPos = file.search(/\.[^.\s]{3,15}$/);
        const ext = file.slice(extPos + 1);
        if (ext === 'html') {
          htmlFiles.push(file);
        }

        i += 1;
        if (i === files.length) resolve(htmlFiles);
      });
    });
  })
  .then(() => {
    return htmlFiles;
  });
}

const collectFiles = function() {
  const cssFiles = [];

  return new Promise((resolve, reject) => {
    fs.readdir(cssPath, function(err, files) {
      let i = 0;
      files.forEach((file, index) => {
        const extPos = file.search(/\.[^.\s]{3,15}$/);
        const ext = file.slice(extPos + 1);
        if (ext === 'css') {
          cssFiles.push(file);
        }

        i += 1;
        if (i === files.length) {
          resolve(cssFiles);
        }
      });
    });
  });
}

const cacheBustingCSS = function() {
  return new Promise((resolve, reject) => {
    htmlFiles.forEach((htmlFile) => {
      fs.readFile(`${htmlPath}/${htmlFile}`, "utf8", (err, data) => {
        let newHTML = data;
        cssFiles.forEach((cssFile) => {
          const hash = getFileHash(`${cssPath}/${cssFile}`);
          const regex = new RegExp(`<link.*(${cssFile}).*>`, 'gm');
          const regexMatch = data.match(regex);
          if (regexMatch) {
            const match = regexMatch[0];
            const filename = cssFile.split('.css');
            const newString = match.replace(cssFile, `${filename[0]}.${hash}.css`);
            newHTML = newHTML.replace(regex, newString);
            fs.renameSync(`${cssPath}/${cssFile}`, `${cssPath}/${filename[0]}.${hash}.css`)
          }
        });

        fs.writeFile(`${htmlPath}/${htmlFile}`, newHTML, 'utf8', (err) => {
          if (err) throw err;
          console.log(`${htmlFile} updated with css cachebusting file names`);
        });
      });
    });

    resolve();
  });
}

const getFileHash = function(file) {
  const buffer = fs.readFileSync(file);
  const hash = md5(buffer).substr(0, 16);
  return hash;
}

export default function() {
  return new Promise((resolve, reject) => {
    getHTMLfiles().then((files) => {
      htmlFiles = files;
      collectFiles().then((files) => {
        cssFiles = files;
        cacheBustingCSS().then(() => resolve);
      });
    });
  });
}
