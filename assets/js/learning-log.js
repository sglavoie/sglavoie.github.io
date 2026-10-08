// The filter above a learning log (partials/learning-log.html): typing
// keeps the entries that contain the text, with the entries they're under
// and, under an entry that matches, everything in it. Days and months left
// with nothing are hidden, and fade in the calendar. ?q= fills it, and
// typing keeps the address in step so a filtered log can be shared.

const delay = 150;

// The log in sections: a day (h3) and what follows it, or what follows a
// month (h2) before its first day. Anything above the first month (the
// introduction) stays as it is.
function sectionsOf(article) {
  const sections = [];
  let month = null;
  let section = null;
  for (const element of article.children) {
    if (element.tagName === "H2" || element.tagName === "H3") {
      month = element.tagName === "H2" ? element : month;
      section = { heading: element, month: month, content: [] };
      sections.push(section);
    } else if (section) {
      section.content.push(element);
    }
  }
  return sections;
}

// The text of an entry itself, without the entries nested under it.
function ownText(item) {
  let text = "";
  for (const node of item.childNodes) {
    if (!(node.nodeType === Node.ELEMENT_NODE && /^(UL|OL)$/.test(node.tagName))) {
      text += node.textContent;
    }
  }
  return text.toLowerCase();
}

// Shows the entries of a list that match, or contain one that does, or sit
// under one that does. Whether any is shown.
function filterList(list, query, underMatch) {
  let shown = false;
  for (const item of list.children) {
    const own = underMatch || ownText(item).includes(query);
    const show = own || item.textContent.toLowerCase().includes(query);
    item.hidden = !show;
    for (const nested of item.querySelectorAll(":scope > ul, :scope > ol")) {
      filterList(nested, query, own);
    }
    shown = shown || show;
  }
  return shown;
}

function filterSection(section, query) {
  let shown = false;
  for (const element of section.content) {
    let show;
    if (!query) {
      element.querySelectorAll("li[hidden]").forEach((item) => (item.hidden = false));
      show = true;
    } else if (/^(UL|OL)$/.test(element.tagName)) {
      show = filterList(element, query, false);
    } else {
      show = element.textContent.toLowerCase().includes(query);
    }
    element.hidden = !show;
    shown = shown || show;
  }
  return shown;
}

export function initLearningLog() {
  const filter = document.querySelector(".learning-log__filter");
  const article = document.querySelector(".article_text");
  if (!filter || !article) {
    return;
  }
  const input = filter.querySelector("input");
  const matches = filter.querySelector(".learning-log__matches");
  const sections = sectionsOf(article);
  const days = new Map(
    Array.from(document.querySelectorAll("a.learning-log__day")).map((link) => [
      decodeURIComponent(link.hash.slice(1)),
      link,
    ]),
  );
  const byDay = sections.some((section) => section.heading.tagName === "H3");

  function apply() {
    const query = input.value.trim().toLowerCase();
    const monthsShown = new Set();
    let count = 0;
    for (const section of sections) {
      const isMonth = section.heading.tagName === "H2";
      // A month heading with no entries of its own waits on its days.
      const shown = filterSection(section, query) && (section.content.length > 0 || !query);
      if (!isMonth || !byDay) {
        section.heading.hidden = !shown;
      }
      if (shown && section.content.length) {
        monthsShown.add(section.month);
        count += 1;
      }
      days.get(section.heading.id)?.classList.toggle("is-filtered-out", Boolean(query) && !shown);
    }
    if (byDay) {
      for (const section of sections) {
        if (section.heading.tagName === "H2") {
          section.heading.hidden = Boolean(query) && !monthsShown.has(section.heading);
        }
      }
    }
    const unit = byDay ? (count === 1 ? "day" : "days") : count === 1 ? "month" : "months";
    const verb = count === 1 ? " matches." : " match.";
    matches.textContent = query ? (count ? count + " " + unit + verb : "Nothing matches.") : "";
    const url = new URL(location.href);
    if (query) {
      url.searchParams.set("q", input.value.trim());
    } else {
      url.searchParams.delete("q");
    }
    history.replaceState(history.state, "", url);
  }

  let timer = 0;
  input.addEventListener("input", function () {
    window.clearTimeout(timer);
    timer = window.setTimeout(apply, delay);
  });
  filter.hidden = false;
  const initial = new URLSearchParams(location.search).get("q");
  if (initial) {
    input.value = initial;
    apply();
  }
}
