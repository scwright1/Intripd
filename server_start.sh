#!/bin/bash

export NODE_ENV='production'
export PATH=/usr/local/bin:$PATH
forever start index.js > /dev/null