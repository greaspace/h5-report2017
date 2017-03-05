#/bin/bash

gulp
rm -rf ../dist
mv dist ../

git checkout gh-pages
git pull origin gh-pages

cd dist
rm -rf $(ls | grep -v fonts)
cd ..

cp -R ../dist ./
rm -rf ../dist

git add .
git commit -m "sync new build"
git push origin gh-pages

git checkout master
