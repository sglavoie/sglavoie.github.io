# This file is only used if you use `make publish` or
# explicitly specify it as your config file.

import os
import sys

sys.path.append(os.curdir)
from pelicanconf import *

# If your site is available via HTTPS, make sure SITEURL begins with https://
SITEURL = "https://www.sglavoie.com"
RELATIVE_URLS = False

FEED_ALL_ATOM = "feeds/sglavoie.atom.xml"
CATEGORY_FEED_ATOM = "feeds/{slug}.atom.xml"
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
FEED_ATOM = None
FEED_ATOM_URL = None
FEED_RSS = None
FEED_ALL_RSS = "feeds/sglavoie.rss.xml"
CATEGORY_FEED_RSS = "feeds/{slug}.rss.xml"

DELETE_OUTPUT_DIRECTORY = True

# Following items are often useful when publishing

DISQUS_SITENAME = "sglavoie"

# Enable tracking of web traffic
GOOGLE_ANALYTICS = "UA-150998392-1"
