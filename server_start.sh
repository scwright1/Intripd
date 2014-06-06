#!/bin/bash

export NODE_ENV='production'
export TOKENKEY='<[63Y4!29R8NZ<Q36@iJX3)QrSPr11'
export PATH=/usr/local/bin:$PATH
forever start index.js > /dev/null