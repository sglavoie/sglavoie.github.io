// Copy buttons and collapsing on code blocks (see render-codeblock.html).

// With line numbers, Chroma renders a table; the code is the last <code>.
function codeOf(block) {
  const codes = block.querySelectorAll("pre code");
  return codes[codes.length - 1];
}

function initCopy() {
  if (!navigator.clipboard) {
    return;
  }
  document.querySelectorAll(".code-block__copy").forEach(function (button) {
    button.hidden = false;
    button.addEventListener("click", function () {
      const code = codeOf(button.closest(".code-block"));
      navigator.clipboard.writeText(code.textContent.replace(/\n$/, "")).then(function () {
        button.textContent = "Copied";
        button.dataset.copied = "";
        window.setTimeout(function () {
          button.textContent = "Copy";
          delete button.dataset.copied;
        }, 1600);
      });
    });
  });
}

// Tall code blocks start collapsed (see post.css). Only blocks well past the
// collapsed height qualify, so expanding is always worth a click.
function initCollapse() {
  const collapsed = parseFloat(getComputedStyle(document.documentElement).fontSize) * 26;
  document.querySelectorAll(".code-block").forEach(function (block) {
    const pre = block.querySelector("pre");
    if (!pre || pre.scrollHeight < collapsed * 1.5) {
      return;
    }
    const lines = codeOf(block).textContent.replace(/\n$/, "").split("\n").length;
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "code-block__toggle";
    toggle.setAttribute("data-pagefind-ignore", "");
    function setExpanded(expanded) {
      block.classList.toggle("is-collapsed", !expanded);
      block.classList.toggle("is-expanded", expanded);
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.textContent = expanded ? "Collapse" : "Show all " + lines + " lines";
    }
    toggle.addEventListener("click", function () {
      const expanding = block.classList.contains("is-collapsed");
      setExpanded(expanding);
      // Collapsing from far below would leave the reader past the block.
      if (!expanding && block.getBoundingClientRect().top < 0) {
        block.scrollIntoView({ block: "start" });
      }
    });
    block.appendChild(toggle);
    setExpanded(false);
  });
}

export function initCodeBlocks() {
  initCopy();
  initCollapse();
}
