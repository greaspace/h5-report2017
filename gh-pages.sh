#/bin/bash

echo "build dist"
gulp

echo "mv dist out"
rm -rf ../dist
mv dist ../

echo "checkout gh-pages branch"
git checkout gh-pages
git pull origin gh-pages

echo "clean old files & add new files"
rm -rf $(ls dist | grep fonts)
cp -R ../dist ./
rm -rf ../dist

echo "sync gh-pages"
git add .
git commit -m "replace with new build"
git push origin gh-pages

echo "back to master"
git checkout master
