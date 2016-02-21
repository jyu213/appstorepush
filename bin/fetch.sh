#!/bin/sh
# Fetch apple data

curdirname=`pwd`
floder=${curdirname}/spider
for file_a in ${floder}/*; do
    python3 $file_a
done
