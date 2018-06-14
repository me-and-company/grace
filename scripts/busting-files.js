const fs = require('fs');
const path = require('path');
const md5 = require('MD5');

const cssPath = './dist/css';
const jsPath = './dist/js';
const htmlPath = './dist';

let htmlFiles = [];

const isDirectory = path => fs.lstatSync(path).isDirectory();

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) {
        if (!results.includes(dir)) results = results.concat(dir);
        return done(null, results);
      }
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          results.push(file);
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else next();
      });
    })();
  });
}

const getAllHTMLFiles = (dirs) => {
  return new Promise((resolve) => {
    const htmlFiles = [];

    dirs.forEach((dir) => {
      const files = fs.readdirSync(dir);
      files.forEach((file, index) => {
        if (!isDirectory(path.resolve(dir, file))) {
          const extPos = file.search(/\.[^.\s]{3,4}$/);
          const ext = file.slice(extPos + 1);
          if (ext === 'html' || ext === 'htm') {
            if ( !htmlFiles.includes(path.join(dir, file)) ) htmlFiles.push(path.join(dir, file));
          }
        }
      });
    });

    resolve(htmlFiles);
  });
}

const collectFiles = function(filepath, filesExt) {
  const collectedFiles = [];

  return new Promise((resolve) => {
    fs.readdir(filepath, function(err, files) {
      let i = 0;
      files.forEach((file, index) => {
        const extPos = file.search(/\.[^.\s]{1,15}$/);
        const ext = file.slice(extPos + 1);
        if (ext === filesExt) {
          const hash = getFileHash(path.join(filepath, file));
          collectedFiles.push({ file, hash });
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
      fs.readFile(`${htmlFile}`, "utf8", (err, data) => {
        const html = getCSSBustingHTML(cssFiles, 0, data);
        fs.writeFile(`${htmlFile}`, html, 'utf8', (err) => {
          if (err) throw err;
          resolve();
          console.log(`${htmlFile} updated with css cachebusting file names`);
        });
      });
    });
  });
}

const getCSSBustingHTML = function(cssFiles, index, html) {
  const cssFile = cssFiles[index].file;
  const regex = new RegExp(`<link.*(${cssFile}).*>`, 'gm');
  const regexMatch = html.match(regex);
  if (regexMatch) {
    const match = regexMatch[0];
    const filename = cssFile.split('.css');
    const newString = match.replace(cssFile, `${filename[0]}.${cssFiles[index].hash}.css`);
    html = html.replace(regex, newString);
    if ( fs.existsSync(path.join(cssPath, cssFile)) ) {
      fs.renameSync(`${cssPath}/${cssFile}`, `${cssPath}/${filename[0]}.${cssFiles[index].hash}.css`);
    }
  }

  if (index < cssFiles.length - 1) return getCSSBustingHTML(cssFiles, index + 1, html);
  else return html;
}

const getJSBustingHTML = function(jsFiles, index, html) {
  const jsFile = jsFiles[index].file;
  const regex = new RegExp(`<script.*(${jsFile}).*>`, 'gm');
  const regexMatch = html.match(regex);
  if (regexMatch) {
    const match = regexMatch[0];
    const filename = jsFile.split('.js');
    const newString = match.replace(jsFile, `${filename[0]}.${jsFiles[index].hash}.js`);
    html = html.replace(regex, newString);
    if ( fs.existsSync(path.join(jsPath, jsFile)) ) {
      fs.renameSync(`${jsPath}/${jsFile}`, `${jsPath}/${filename[0]}.${jsFiles[index].hash}.js`);
    }
  }

  if (index < jsFiles.length - 1) return getJSBustingHTML(jsFiles, index + 1, html);
  else return html;
}

const cacheBustingJS = function(jsFiles) {
  return new Promise((resolve) => {
    htmlFiles.forEach((htmlFile) => {
      fs.readFile(`${htmlFile}`, "utf8", (err, data) => {
        const html = getJSBustingHTML(jsFiles, 0, data);
        fs.writeFile(`${htmlFile}`, html, 'utf8', (err) => {
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
  return new Promise((resolve, reject) => {
    walk(htmlPath, (err, results) => getAllHTMLFiles(results).then((files) => {
      htmlFiles = files;
      collectFiles(cssPath, 'css').then((files) => {
        cacheBustingCSS(files).then(() => {
          collectFiles(jsPath, 'js')
          .then(files => cacheBustingJS(files))
          .then(() => resolve());
        });
      });
    }));
  });
}
