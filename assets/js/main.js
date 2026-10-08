// Site-wide behaviour, bundled by js.Build in baseof.html. Loaded with
// defer, so the document is parsed and pagefind-ui.js has run.
import { initCodeBlocks } from "./code-blocks.js";
import { initNavFades } from "./nav.js";
import { initSearch } from "./search.js";
import { initShortcuts } from "./shortcuts.js";
import { initTheme } from "./theme.js";

initSearch();
initTheme();
initNavFades();
initCodeBlocks();
initShortcuts();
