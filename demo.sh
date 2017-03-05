#!/bin/bash

gulp
rm -rf ../dist
mv dist ../
gulp clean

git checkout gh-pages
rm -rf $(ls dist | grep -v fonts)
cp -R ../dist ./
git add .
git commit -m "auto update"
git push origin gh-pages

rm -rf ../dist
git checkout master
