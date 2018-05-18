const fs = require('fs');
const md5 = require('MD5');

const cssPath = './dist/css';
const jsPath = './dist/js';
const htmlPath = './dist';

let htmlFiles;


const getHTMLfiles = function() {
  const htmlFiles = [];

  return new Promise((resolve) => {
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
  });
}

const collectCSSFiles = function() {
  return new Promise((resolve) => {
    const cssFiles = collectFiles(cssPath, 'css')
    .then(files => resolve(files));
  });
}

const collectFiles = function(path, filesExt) {
  const collectedFiles = [];

  return new Promise((resolve) => {
    fs.readdir(path, function(err, files) {
      let i = 0;
      files.forEach((file, index) => {
        const extPos = file.search(/\.[^.\s]{1,15}$/);
        const ext = file.slice(extPos + 1);
        if (ext === filesExt) {
          collectedFiles.push(file);
        }

        i += 1;
        if (i === files.length) {
          resolve(collectedFiles);
        }
      });
    });
  });
}

const cacheBustingCSS = function(cssFiles) {
  return new Promise((resolve) => {
    htmlFiles.forEach((htmlFile) => {
      fs.readFile(`${htmlPath}/${htmlFile}`, "utf8", (err, data) => {
        const html = getCSSBustingHTML(cssFiles, 0, data);
        fs.writeFile(`${htmlPath}/${htmlFile}`, html, 'utf8', (err) => {
          if (err) throw err;
          resolve();
          console.log(`${htmlFile} updated with css cachebusting file names`);
        });
      });
    });
  });
}

const getCSSBustingHTML = function(cssFiles, index, html) {
  const cssFile = cssFiles[index];
  const hash = getFileHash(`${cssPath}/${cssFile}`);
  const regex = new RegExp(`<link.*(${cssFile}).*>`, 'gm');
  const regexMatch = html.match(regex);
  if (regexMatch) {
    const match = regexMatch[0];
    const filename = cssFile.split('.css');
    const newString = match.replace(cssFile, `${filename[0]}.${hash}.css`);
    html = html.replace(regex, newString);
    fs.renameSync(`${cssPath}/${cssFile}`, `${cssPath}/${filename[0]}.${hash}.css`);
  }

  if (index < cssFiles.length - 1) return getCSSBustingHTML(cssFiles, index + 1, html);
  else return html;
}

const getJSBustingHTML = function(jsFiles, index, html) {
  const jsFile = jsFiles[index];
  const hash = getFileHash(`${jsPath}/${jsFile}`);
  const regex = new RegExp(`<script.*(${jsFile}).*>`, 'gm');
  const regexMatch = html.match(regex);
  if (regexMatch) {
    const match = regexMatch[0];
    const filename = jsFile.split('.js');
    const newString = match.replace(jsFile, `${filename[0]}.${hash}.js`);
    html = html.replace(regex, newString);
    fs.renameSync(`${jsPath}/${jsFile}`, `${jsPath}/${filename[0]}.${hash}.js`);
  }

  if (index < jsFiles.length - 1) return getJSBustingHTML(jsFiles, index + 1, html);
  else return html;
}

const cacheBustingJS = function(jsFiles) {
  return new Promise((resolve) => {
    htmlFiles.forEach((htmlFile) => {
      fs.readFile(`${htmlPath}/${htmlFile}`, "utf8", (err, data) => {
        const html = getJSBustingHTML(jsFiles, 0, data);
        fs.writeFile(`${htmlPath}/${htmlFile}`, html, 'utf8', (err) => {
          if (err) throw err;
          resolve();
          console.log(`${htmlFile} updated with js cachebusting file names`);
        });
      });
    });
  });
}

const getFileHash = function(file) {
  const buffer = fs.readFileSync(file);
  const hash = md5(buffer).substr(0, 16);
  return hash;
}

export default function() {
  return new Promise((resolve) => {
    getHTMLfiles().then((files) => {
      htmlFiles = files;
      collectFiles(cssPath, 'css').then((files) => {
        cacheBustingCSS(files).then(() => {
          collectFiles(jsPath, 'js').then(files => cacheBustingJS(files));
        });
      });
    }).catch(error => console.log(error));
  });
}
