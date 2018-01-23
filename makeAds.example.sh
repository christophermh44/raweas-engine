#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
filename=$(date --date="tomorrow" +%Y%m%d)
year=$(date --date="tomorrow" +%Y)
month=$(date --date="tomorrow" +%m)
day=$(date --date="tomorrow" +%d)
prefix=/mnt/radiodj/PLAYLISTS/ADS/$filename-
npm run --silent make-screens "$prefix" $year $month $day
