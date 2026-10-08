// Site-wide behaviour, bundled by js.Build in baseof.html. Loaded with
// defer, so the document is parsed and pagefind-ui.js has run. Page-specific
// parts return early on pages without their elements.
import { initArchivesFilter } from "./archives.js";
import { initCodeBlocks } from "./code-blocks.js";
import { initFootnotes } from "./footnotes.js";
import { initHeadingLinks } from "./headings.js";
import { initNavFades } from "./nav.js";
import { initNotFound } from "./not-found.js";
import { initOffline, initSavedPages } from "./offline.js";
import { initRandomPost } from "./random.js";
import { initReadingPosition, initReadMarks } from "./reading.js";
import { initHighlight, initSearch } from "./search.js";
import { initShare } from "./share.js";
import { initShortcuts } from "./shortcuts.js";
import { initTables } from "./tables.js";
import { initTheme } from "./theme.js";
import { initTocScrollspy } from "./toc.js";
import { initZoom } from "./zoom.js";

initSearch();
initHighlight();
initTheme();
initNavFades();
initCodeBlocks();
initTables();
initHeadingLinks();
initFootnotes();
initShortcuts();
initShare();
initZoom();
initOffline();
initReadingPosition();
initReadMarks();
initTocScrollspy();
initArchivesFilter();
initNotFound();
initRandomPost();
initSavedPages();
