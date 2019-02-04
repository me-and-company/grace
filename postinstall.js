const fs = require('fs');

fs.mkdir('./src/js/libs/', (err) => {
  if (err && err.code !== 'EEXIST') throw err;
});
fs.mkdir('./src/js/libs/first/', (err) => {
  if (err && err.code !== 'EEXIST') throw err;
});
fs.mkdir('./src/js/singles/', (err) => {
  if (err && err.code !== 'EEXIST') throw err;
});


fs.copyFile('node_modules/@babel/polyfill/dist/polyfill.min.js', './src/js/singles/polyfill.js', (err) => {
  if (err) throw err;
  console.log('babel-polyfill was copied to destination');
});
