import type { GenerateResponse, Section } from "./api";

// Tiny markdown renderer — paragraphs and italics only.
// We never accept HTML from the server; output is built as text-and-elements.
function renderBody(markdown: string): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "first-read__section-body";
  const paragraphs = markdown.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  for (const para of paragraphs) {
    const p = document.createElement("p");
    // Light italic support: *like this* → <em>like this</em>. Nothing else.
    const parts = para.split(/(\*[^*]+\*)/g);
    for (const part of parts) {
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        const em = document.createElement("em");
        em.textContent = part.slice(1, -1);
        p.appendChild(em);
      } else if (part) {
        p.appendChild(document.createTextNode(part));
      }
    }
    wrapper.appendChild(p);
  }
  return wrapper;
}

function renderRedacted(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "first-read__section-body first-read__section-body--redacted";
  for (let i = 0; i < 3; i++) {
    const line = document.createElement("span");
    line.className = "first-read__redact-line";
    line.style.width = `${72 + Math.random() * 22}%`;
    wrap.appendChild(line);
  }
  return wrap;
}

function sectionEl(section: Section, isClosing: boolean): HTMLElement {
  const article = document.createElement("section");
  article.className = "first-read__section";
  article.dataset.index = String(section.index);
  if (section.locked) article.classList.add("first-read__section--locked");
  if (isClosing) article.classList.add("first-read__section--closing");

  const label = document.createElement("p");
  label.className = "first-read__section-label";
  label.textContent = `${String(section.index).padStart(2, "0")}`;

  const title = document.createElement("h3");
  title.className = "first-read__section-title";
  title.textContent = section.title;

  article.appendChild(label);
  article.appendChild(title);

  if (section.locked) {
    // Locked: show only the first sentence as a teaser, then redacted lines.
    const firstSentence = extractFirstSentence(section.body);
    const teaserBody = document.createElement("div");
    teaserBody.className = "first-read__section-body";
    const p = document.createElement("p");
    p.textContent = firstSentence;
    teaserBody.appendChild(p);
    article.appendChild(teaserBody);
    article.appendChild(renderRedacted());
  } else {
    article.appendChild(renderBody(section.body));
  }

  return article;
}

function extractFirstSentence(body: string): string {
  const flat = body.replace(/\n+/g, " ").trim();
  const match = flat.match(/^(.+?[.!?])(\s|$)/);
  return match ? match[1] : flat.slice(0, 140) + "…";
}

export function mountTeaser(response: GenerateResponse): void {
  const cover = document.getElementById("memo-cover-echo");
  const date = document.getElementById("memo-cover-date");
  const body = document.getElementById("memo-body");
  if (!cover || !date || !body) return;

  cover.textContent = response.cover.echo;
  date.textContent = response.cover.date;

  body.replaceChildren();
  for (const section of response.sections) {
    const isClosing = section.index === response.sections.length;
    body.appendChild(sectionEl(section, isClosing));
  }
}

export function mountFull(sections: Section[]): void {
  const body = document.getElementById("memo-body");
  if (!body) return;
  // Cross-fade in place: replace each section, but keep visual continuity.
  body.classList.add("first-read__body--unlocking");
  body.replaceChildren();
  for (const section of sections) {
    const isClosing = section.index === sections.length;
    body.appendChild(sectionEl(section, isClosing));
  }
  // next frame, drop the class so the new content fades in
  requestAnimationFrame(() => {
    body.classList.remove("first-read__body--unlocking");
  });
}
