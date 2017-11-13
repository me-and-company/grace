#!/bin/bash

if [ -f "Brewfile" ] && [ "$(uname -s)" = "Darwin" ]; then
  brew bundle check >/dev/null 2>&1  || {
    echo "==> Installing Homebrew dependencies…"
    brew bundle
  }
fi

mkdir -p ./src/js/libs/first
mkdir -p ./src/js/singles
cp node_modules/babel-polyfill/dist/polyfill.min.js src/js/singles/polyfill.js
cp node_modules/jquery/dist/jquery.min.js src/js/libs/first/jquery.js
