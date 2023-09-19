from datetime import datetime
import csv
import os
import shutil


def delete_existing_redirects_output() -> None:
    """Get a list of the redirects we last generated and remove only those in output/"""
    with open("redirects/redirects_generated.txt") as f:
        redirects = f.read().splitlines()
    for redirect in redirects:
        redirect_output = f"output/{redirect}.html"
        try:
            os.remove(redirect_output)
        except FileNotFoundError:
            pass
        else:
            print(f"Removed redirect page: {redirect_output}")


def get_redirect_html_template() -> str:
    with open("config_helpers/html_template.html") as f:
        return f.read()


def write_redirect_html_templates(redirects: list[dict]) -> None:
    # Delete any existing redirects: we'll recreate an updated list
    if os.path.exists("redirects"):
        shutil.rmtree("redirects")
    os.mkdir("redirects")

    # Fill out each template to be generated to create the redirect
    base_template = get_redirect_html_template()
    pages = []
    for page in redirects:
        page_template = base_template
        page_url = page["pageURL"]
        page_title = page["pageTitle"]
        redirect_url = page["redirectURL"]
        page_template = page_template.replace("PAGE_URL", page_url)
        page_template = page_template.replace("PAGE_TITLE", page_title)
        page_template = page_template.replace("REDIRECT_URL", redirect_url)
        with open(f"redirects/{page_url}.html", "w") as f:
            f.write(page_template)
        pages.append(page_url)

    # Store a list of the redirects we just created in output/ so we can later delete
    # them when updating the redirects
    with open("redirects/redirects_generated.txt", "w") as f:
        for page in sorted(pages):
            f.write(f"{page}\n")


def generate_redirect_pages_on_the_fly() -> None:
    """Generate HTML pages that will redirect to specific URLs based on a list of
    redirects provided in config_helpers/redirects.csv."""
    with open("config_helpers/redirects.csv") as f:
        # Read CSV lines as list of dicts, skip the header row
        redirects = [
            {k: v for k, v in row.items()}
            for row in csv.DictReader(f, skipinitialspace=True)
        ]

    # Delete existing redirects before generating the new list from the CSV file
    delete_existing_redirects_output()

    write_redirect_html_templates(redirects)

    if not os.path.exists("output"):
        os.mkdir("output")

    # Copy the redirect HTML files to the output/ directory
    for filename in sorted(os.listdir("redirects")):
        shutil.copy(f"redirects/{filename}", f"output/{filename}")
        if filename == "redirects_generated.txt":
            continue  # it's not a redirect page but we do want to keep it around
        print(f"Created redirect page: {filename}")


# Pelican-specific settings
PATH = "content"

STATIC_PATHS = ["files", "images", "extra/CNAME"]
EXTRA_PATH_METADATA = {"extra/CNAME": {"path": "CNAME"}}

DISPLAY_PAGES_ON_MENU = False
DEFAULT_PAGINATION = 5

USE_FOLDER_AS_CATEGORY = True
DEFAULT_CATEGORY = "misc"
DISPLAY_CATEGORIES_ON_MENU = True

# Allows to automatically update to today's date for a page that does not
# specify a date
t = datetime.today()
DEFAULT_DATE = (t.year, t.month, t.day, t.hour, t.minute, t.second)

TYPOGRIFY = True

ARTICLE_URL = "posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/"
ARTICLE_SAVE_AS = "posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html"

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True

# Site-specific
AUTHOR = "Sébastien Lavoie"
DEFAULT_DATE_FORMAT = "%B %-d, %Y"
DEFAULT_LANG = "en"
DISQUS_SITENAME = "sglavoie"
LOCALE = "en_US.UTF-8"
SITENAME = "sglavoie.com"
SITEURL = "https://www.sglavoie.com"
TIMEZONE = "America/Mexico_City"

# Theme-specific
THEME = "theme"
USER_LOGO_URL = SITEURL + "/theme/images/logo.png"

# Enable tracking of web traffic
GOOGLE_ANALYTICS = "UA-150998392-1"

# Plugins
PLUGIN_PATHS = ["plugins"]
PLUGINS = [
    "div_around_tables",
    "extract_toc",
    "readtime",
    "render_math",
    "tag_cloud",
]

# render_math plugin
MATH_JAX = {"color": "#007bff"}

# https://github.com/pelican-plugins/tag-cloud
TAG_CLOUD_BADGE = True
TAG_CLOUD_SORTING = "alphabetically"
TAG_CLOUD_MAX_ITEMS = 100
TAG_CLOUD_STEPS = 8

# `fenced_code` enables the following syntax for code blocks and make it
# possible to use special symbols, among other things:
# ~~~~{.language_name_here}
# code goes here
# ~~~~
MARKDOWN = {
    "extension_configs": {
        "markdown.extensions.codehilite": {"css_class": "highlight"},
        "markdown.extensions.fenced_code": {},
        "markdown.extensions.extra": {},
        "markdown.extensions.meta": {},
        "markdown.extensions.toc": {},
    },
    "output_format": "html5",
}

# Feed generation is usually not desired when developing
# FEED_DOMAIN = SITEURL
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

# Pages to render as templates directly in HTML (no Markdown parsing)
generate_redirect_pages_on_the_fly()
