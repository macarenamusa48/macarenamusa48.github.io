const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const intro = document.querySelector(".intro");

function boot() {
  document.body.classList.add("ready");
}

if (reducedMotion.matches || location.hash) {
  boot();
} else {
  const digits = intro.querySelector(".intro-count");
  const fill = intro.querySelector(".intro-track span");
  const mark = intro.querySelector(".intro-mark");
  const target = document.querySelector(".site-header .monogram");
  const strips = [" 1", " 1234567890", "01234567890"].map((characters) => {
    const strip = document.createElement("span");
    for (const character of characters) {
      const cell = document.createElement("span");
      cell.textContent = character;
      strip.append(cell);
    }
    digits.insertBefore(strip, digits.lastElementChild);
    return strip;
  });

  intro.hidden = false;
  document.body.classList.add("intro-active");
  let fontReady = false;
  document.fonts.load('300 1em Poppins').catch(() => {}).then(() => {
    digits.classList.add("visible");
    fontReady = true;
  });

  function render(value) {
    const whole = Math.min(99, Math.floor(value));
    const fraction = value - whole;
    const ones = whole % 10;
    const tens = Math.floor(whole / 10);
    const rollover = ones === 9 ? fraction : 0;
    const offsets = [tens === 9 ? rollover : 0, tens + rollover, ones + fraction];
    strips.forEach((strip, index) => { strip.style.transform = "translateY(" + -offsets[index] + "em)"; });
    fill.style.width = value + "%";
  }

  function depart() {
    const large = mark.getBoundingClientRect();
    const small = target.getBoundingClientRect();
    const x = small.left + (small.width - large.width) / 2 - large.left;
    const y = small.top + (small.height - large.height) / 2 - large.top;
    mark.style.transform = "translate(" + x + "px, " + y + "px) scale(" + small.width / large.width + ")";
    intro.classList.add("depart");
    boot();
    setTimeout(() => {
      document.body.classList.remove("intro-active");
      intro.classList.add("landed");
    }, 800);
    setTimeout(() => { intro.hidden = true; }, 1400);
  }

  const ease = (time) => 1 - (1 - time) ** 4;
  const start = performance.now();
  let finishStart;
  render(0);
  function advance(now) {
    const drawing = Math.min(1, (now - start) / 1400);
    if (drawing === 1 && fontReady && finishStart === undefined) finishStart = now;
    const finishing = finishStart === undefined ? 0 : Math.min(1, (now - finishStart) / 700);
    render(90 * ease(drawing) + 10 * ease(finishing));
    if (finishing < 1) requestAnimationFrame(advance);
    else setTimeout(depart, 250);
  }
  requestAnimationFrame(advance);
}

const header = document.querySelector(".site-header");
const menuButton = header.querySelector(".menu-trigger");
const menu = document.querySelector("#navigation");
const sections = [...document.querySelectorAll("main > section")];
const menuLinks = [...menu.querySelectorAll("nav a")];
let activeSection;
let pendingScroll = false;

function updateScroll() {
  pendingScroll = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty("--read", max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0);
  const activationLine = header.getBoundingClientRect().bottom;
  const active = sections.findLast((section) => section.getBoundingClientRect().top <= activationLine);
  if (active) {
    const bounds = active.getBoundingClientRect();
    header.style.setProperty("--header-left", Math.max(0, bounds.left) + "px");
    header.style.setProperty("--header-right", Math.max(0, document.documentElement.clientWidth - bounds.right) + "px");
  }
  if (active && active !== activeSection) {
    activeSection = active;
    header.style.setProperty("--header-fill", getComputedStyle(active).backgroundColor);
    header.style.setProperty("--header-ink", active.id === "contact" ? "#e0f5eb" : "#142421");
    for (const link of menuLinks) {
      if (link.hash === "#" + active.id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }
  if (!reducedMotion.matches) {
    const contact = sections.at(-1);
    const top = contact.getBoundingClientRect().top;
    if (top < innerHeight) contact.style.setProperty("--signature-shift", Math.max(-22, Math.min(48, top * .10)) + "px");
  }
}
function queueScroll() {
  if (pendingScroll) return;
  pendingScroll = true;
  requestAnimationFrame(updateScroll);
}
window.addEventListener("scroll", queueScroll, { passive: true });
window.addEventListener("resize", queueScroll);
updateScroll();

menuButton.hidden = false;
menuButton.addEventListener("click", () => menu.showModal());
let destination;
function closeMenu() {
  if (menu.classList.contains("closing")) return;
  if (reducedMotion.matches) {
    menu.close();
  } else {
    menu.classList.add("closing");
    setTimeout(() => menu.close(), 230);
  }
}
menu.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  closeMenu();
});
menu.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeMenu();
});
menu.addEventListener("click", (event) => {
  const link = event.target.closest("nav a");
  if (!link) return;
  event.preventDefault();
  destination = link.hash;
  closeMenu();
});
menu.addEventListener("close", () => {
  menu.classList.remove("closing");
  if (!destination) return;
  const target = document.querySelector(destination);
  history.pushState(null, "", destination);
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  target.scrollIntoView();
  destination = undefined;
});

const certificateLink = document.querySelector("#view-certificate");
const certificateDialog = document.querySelector("#certificate-dialog");
if (typeof certificateDialog.showModal === "function") {
  certificateLink.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    certificateDialog.querySelector("img").src = certificateLink.href;
    certificateDialog.showModal();
  });
}

const companyTabs = document.querySelector("#experience .company-tabs");
const tabs = [...companyTabs.querySelectorAll('[role="tab"]')];
const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
let selected = 0;

function positionMarker() {
  const tab = tabs[selected];
  for (const [key, value] of Object.entries({ x: tab.offsetLeft, y: tab.offsetTop, w: tab.offsetWidth, h: tab.offsetHeight })) {
    companyTabs.style.setProperty("--tab-" + key, value + "px");
  }
  companyTabs.classList.add("positioned");
}
function selectCompany(index, focus = false) {
  selected = index;
  for (const [i, tab] of tabs.entries()) {
    const current = i === index;
    tab.setAttribute("aria-selected", current);
    tab.tabIndex = current ? 0 : -1;
    panels[i].hidden = !current;
    panels[i].classList.toggle("enter", current);
  }
  positionMarker();
  queueScroll();
  if (focus) tabs[index].focus();
}

companyTabs.hidden = false;
panels.forEach((panel, index) => {
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tabs[index].id);
  panel.tabIndex = 0;
  tabs[index].addEventListener("click", () => selectCompany(index));
});
companyTabs.addEventListener("keydown", (event) => {
  const last = tabs.length - 1;
  const next = { ArrowUp: (selected + last) % tabs.length, ArrowDown: (selected + 1) % tabs.length, Home: 0, End: last }[event.key];
  if (next === undefined) return;
  event.preventDefault();
  selectCompany(next, true);
});
window.addEventListener("resize", positionMarker);
selectCompany(0);

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("arrived");
      observer.unobserve(entry.target);
    }
  }, { threshold: .12 });
  const steps = document.querySelector(".steps");
  [...steps.children].forEach((step, index) => step.style.setProperty("--step", index));
  document.querySelectorAll(".sheet h2, .steps, .signature, .stack-card, .credential, .project").forEach((element) => observer.observe(element));
}

if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const note = document.querySelector(".cursor-note");
  document.addEventListener("pointermove", (event) => {
    const source = event.target.closest("[data-note]");
    note.hidden = !source || event.pointerType !== "mouse";
    if (note.hidden) return;
    note.textContent = source.dataset.note;
    const x = Math.max(4, Math.min(event.clientX + 14, innerWidth - note.offsetWidth - 8));
    const y = Math.max(4, Math.min(event.clientY + 14, innerHeight - note.offsetHeight - 8));
    note.style.transform = "translate(" + x + "px, " + y + "px)";
  });
  document.documentElement.addEventListener("pointerleave", () => { note.hidden = true; });
}
