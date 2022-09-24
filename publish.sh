#!/bin/bash

cp content/pages/404.md output/404.md
invoke rebuild
cp redirects/*.html output/
ghp-import output && git push origin gh-pages
