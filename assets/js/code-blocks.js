// Copy buttons, wrapping and collapsing on code blocks (see render-codeblock.html).

// With line numbers, Chroma renders a table; the code is the last <code>.
function codeOf(block) {
  const codes = block.querySelectorAll("pre code");
  return codes[codes.length - 1];
}

// What the copy button copies. In a shell block with prompts, only the
// commands: the lines after a "$ " prompt and the ones a trailing "\"
// continues, without the prompt. Output lines are left out.
function copiedText(block) {
  const code = codeOf(block);
  if (!block.hasAttribute("data-prompted")) {
    return code.textContent.replace(/\n$/, "");
  }
  const commands = [];
  let continued = false;
  code.querySelectorAll(".line").forEach(function (line) {
    const prompt = line.querySelector(".code-block__prompt");
    const text = line.textContent.replace(/\n$/, "");
    if (prompt) {
      commands.push(text.slice(prompt.textContent.length));
    } else if (continued) {
      commands.push(text);
    } else {
      return;
    }
    continued = /\\$/.test(text);
  });
  return commands.join("\n");
}

function initCopy() {
  if (!navigator.clipboard) {
    return;
  }
  document.querySelectorAll(".code-block__copy").forEach(function (button) {
    button.hidden = false;
    button.addEventListener("click", function () {
      navigator.clipboard.writeText(copiedText(button.closest(".code-block"))).then(function () {
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

// A "Wrap" button on blocks whose lines run past their width: wrapped, they
// read without scrolling sideways. Blocks that wrap from the start
// (code-block--wrap) don't need it. Widths change with the window, so the
// button comes and goes with the overflow, but stays on a wrapped block to
// undo it.
function initWrap() {
  const buttons = Array.from(document.querySelectorAll(".code-block__wrap")).filter(function (button) {
    if (button.closest(".code-block").classList.contains("code-block--wrap")) {
      button.remove();
      return false;
    }
    return true;
  });
  if (!buttons.length) {
    return;
  }
  function update() {
    buttons.forEach(function (button) {
      const block = button.closest(".code-block");
      const pre = block.querySelector("pre");
      const wrapped = button.getAttribute("aria-pressed") === "true";
      button.hidden = !wrapped && (!pre || pre.scrollWidth <= pre.clientWidth);
    });
  }
  buttons.forEach(function (button) {
    const block = button.closest(".code-block");
    button.addEventListener("click", function () {
      const wrapping = button.getAttribute("aria-pressed") !== "true";
      block.classList.toggle("code-block--wrapped", wrapping);
      button.setAttribute("aria-pressed", String(wrapping));
      update();
    });
  });
  update();
  window.addEventListener("resize", update, { passive: true });
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
  initWrap();
  initCollapse();
}
