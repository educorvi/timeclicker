#!/usr/bin/env sh
cd client
yarn run build
cd ..
node server/dist/src/index.js
