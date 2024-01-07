import logging

from pelican import ArticlesGenerator
from pelican import signals
from pelican.contents import Article

log = logging.getLogger(__name__)

def flag_skimming_notes(generator: ArticlesGenerator) -> None:
    for article in generator.articles:
        if not article_contains_skimming_notes_tag(article):
            continue

        article.metadata["is_skim_notes"] = True

def article_contains_skimming_notes_tag(article: Article) -> bool:
    for tag in getattr(article, "tags", []):
        if tag.slug == "skimming-notes":
            return True
    return False

def register():
    signals.article_generator_finalized.connect(flag_skimming_notes)
