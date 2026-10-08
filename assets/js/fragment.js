// Links to a passage: with text selected in a post, the "c" shortcut and the
// share button give an address ending in #:~:text=, which browsers scroll
// to and highlight.

// Past this many words, the link names the first and last few, the way
// browsers write such links themselves.
const maxWords = 8;
const edgeWords = 4;

// Commas and dashes separate the parts of a text directive.
function encode(text) {
  return encodeURIComponent(text).replace(/-/g, "%2D").replace(/,/g, "%2C");
}

// `url` with a text fragment for the passage selected in the article, or
// null when there's none.
export function selectionURL(url) {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) {
    return null;
  }
  const article = document.querySelector(".article_text");
  const range = selection.getRangeAt(0);
  if (!article || !article.contains(range.commonAncestorContainer)) {
    return null;
  }
  const words = selection.toString().trim().split(/\s+/).filter(Boolean);
  if (!words.length) {
    return null;
  }
  const text =
    words.length > maxWords
      ? encode(words.slice(0, edgeWords).join(" ")) + "," + encode(words.slice(-edgeWords).join(" "))
      : encode(words.join(" "));
  const link = new URL(url);
  link.search = "";
  link.hash = ":~:text=" + text;
  return link.href;
}
