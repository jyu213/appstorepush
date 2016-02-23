#!/bin/sh
# Fetch apple data

path=/Library/WebServer/Documents/nodejs/appstorepush
floder=./spider
for file_a in ${path}/spider/*; do
    python3 $file_a
done
echo $(date +%Y%m%d) >> ${path}/logs/fetch.log
