from pelican import signals, contents
from bs4 import BeautifulSoup


def div_around_tables(content):
    """
    Surround <table> tags with <div> to allow scrolling horizontally.
    """
    if isinstance(content, contents.Static):
        return

    soup = BeautifulSoup(content._content, "html.parser")

    for table in soup.findAll("table"):
        table.wrap(soup.new_tag("div", attrs={"style": "overflow-x: auto"}))

    soup.renderContents()
    content._content = soup.decode()


def register():
    signals.content_object_init.connect(div_around_tables)
