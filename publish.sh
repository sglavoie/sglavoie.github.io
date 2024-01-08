#!/bin/bash

cp content/pages/404.md output/404.md
invoke rebuild
cp redirects/*.html output/
npx -y pagefind --site output
ghp-import output && git push origin gh-pages
