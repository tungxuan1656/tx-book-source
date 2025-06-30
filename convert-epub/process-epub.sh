#!/bin/bash

FILE_EPUB=$1
KEY_EPUB=$2
NAME_EPUB=$3
AUTHUR_EPUB=$4

echo "File EPUB: $FILE_EPUB"
mkdir -p "./input/$KEY_EPUB"
mkdir -p "./output/$KEY_EPUB"
cp "$FILE_EPUB" "./input/$KEY_EPUB/$KEY_EPUB.epub"
cd "./input/$KEY_EPUB"
unzip -o "$KEY_EPUB.epub"
cd ../..
node convert-epub.js "./input/$KEY_EPUB" "./output/$KEY_EPUB" "$KEY_EPUB" "$NAME_EPUB" "$AUTHUR_EPUB"
