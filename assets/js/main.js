// Site-wide behaviour, bundled by js.Build in baseof.html. Loaded with
// defer, so the document is parsed and pagefind-ui.js has run.
import { initCodeBlocks } from "./code-blocks.js";
import { initHeadingLinks } from "./headings.js";
import { initNavFades } from "./nav.js";
import { initHighlight, initSearch } from "./search.js";
import { initShare } from "./share.js";
import { initShortcuts } from "./shortcuts.js";
import { initTheme } from "./theme.js";
import { initZoom } from "./zoom.js";

initSearch();
initHighlight();
initTheme();
initNavFades();
initCodeBlocks();
initHeadingLinks();
initShortcuts();
initShare();
initZoom();
