#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
filename=$(date --date="tomorrow" +%Y%m%d)
file=/mnt/radiodj/PLAYLISTS/AFTERWORK/$filename.m3u
npm run --silent make-playlist "$DIR/models/afterwork.model" "$file"
