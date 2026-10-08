// Article tables sort by a column when its header is clicked: ascending,
// then descending, then back to the order of the post. Tables with fewer
// than three rows don't need it. Without JavaScript, the headers stay text.

const minRows = 3;
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

function cellText(row, column) {
  const cell = row.cells[column];
  return cell ? cell.textContent.trim() : "";
}

// A number, ignoring thousands separators, units and signs around it, or
// NaN for anything else.
function numberOf(text) {
  const match = text.replace(/,/g, "").match(/^[^\d-]*(-?\d+(?:\.\d+)?)\s*\S*$/);
  return match ? parseFloat(match[1]) : NaN;
}

// Rows by one column, in one direction (1 or -1). Empty cells go last
// either way.
function compareBy(rows, column, direction) {
  const numeric = rows.every((row) => {
    const text = cellText(row, column);
    return text === "" || !Number.isNaN(numberOf(text));
  });
  return function (a, b) {
    const left = cellText(a, column);
    const right = cellText(b, column);
    if (!left || !right) {
      return (left ? 0 : 1) - (right ? 0 : 1);
    }
    return direction * (numeric ? numberOf(left) - numberOf(right) : collator.compare(left, right));
  };
}

function makeSortable(table) {
  const body = table.tBodies[0];
  const headers = table.tHead ? Array.from(table.tHead.rows[0]?.cells || []) : [];
  if (!body || body.rows.length < minRows || !headers.length) {
    return;
  }
  const original = Array.from(body.rows);
  headers.forEach(function (header, column) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "table-sort";
    button.append(...header.childNodes);
    header.append(button);
    button.addEventListener("click", function () {
      const order = header.getAttribute("aria-sort");
      const next = order === "ascending" ? "descending" : order === "descending" ? "none" : "ascending";
      headers.forEach((other) => other.removeAttribute("aria-sort"));
      let rows = original.slice();
      if (next !== "none") {
        // Stable, so ties keep the post's order in both directions.
        rows.sort(compareBy(rows, column, next === "ascending" ? 1 : -1));
        header.setAttribute("aria-sort", next);
      }
      body.append(...rows);
    });
  });
}

export function initTables() {
  document.querySelectorAll(".article_text .table-wrapper table").forEach(makeSortable);
}
