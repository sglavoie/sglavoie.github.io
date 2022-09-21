#!/bin/bash

cp content/pages/404.md output/404.md
invoke rebuild
ghp-import output && git push origin gh-pages
