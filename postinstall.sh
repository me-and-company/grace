#!/bin/bash

mkdir -p ./src/js/libs/first
mkdir -p ./src/js/singles
cp node_modules/babel-polyfill/dist/polyfill.min.js src/js/singles/polyfill.js
cp node_modules/jquery/dist/jquery.min.js src/js/libs/first/jquery.js
