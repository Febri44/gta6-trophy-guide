// Leonida Trophy Guide — tracker logic. No network: data is local, progress is localStorage.
const DATA_URL = "data/trophies.json";
const STORE_KEY = "gta6-trophy-guide-v1";

const listEl = document.getElementById("trophyList");
const emptyEl = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const gradeFilter = document.getElementById("gradeFilter");
const spoilerToggle = document.getElementById("spoilerToggle");
const earnedOnlyToggle = document.getElementById("earnedOnlyToggle");
const remainingOnlyToggle = document.getElementById("remainingOnlyToggle");
const resultsLine = document.getElementById("resultsLine");
const progressFill = document.getElementById("progressFill");
const earnedCountEl = document.getElementById("earnedCount");
const progressPctEl = document.getElementById("progressPct");
const platinumStateEl = document.getElementById("platinumState");
const dialog = document.getElementById("detailDialog");
const detailBody = document.getElementById("detailBody");

let trophies = [];
let earned = new Set();
let activeKind = "all";

function loadEarned() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const ids = Array.isArray(parsed) ? parsed : parsed.earned;
    return new Set((ids || []).filter((n) => Number.isInteger(n)));
  } catch {
    return new Set();
  }
}

function saveEarned() {
  localStorage.setItem(STORE_KEY, JSON.stringify({ earned: [...earned].sort((a, b) => a - b) }));
}

const GRADE_LABEL = { platinum: "Plat", gold: "Gold", silver: "Silv", bronze: "Bron" };
const STAGE_LABEL = { 1: "Stage 1 — Story", 2: "Stage 2 — 100% checklist", 3: "Stage 3 — Clean-up" };

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function gradeBadge(t) {
  return el("span", "grade-badge grade-" + t.grade, GRADE_LABEL[t.grade]);
}

function tagRow(t) {
  const row = el("div", "trophy-meta");
  row.appendChild(el("span", "tag", t.kind));
  row.appendChild(el("span", "tag", STAGE_LABEL[t.stage]));
  if (t.missable) row.appendChild(el("span", "tag missable", "Missable"));
  if (t.hidden) row.appendChild(el("span", "tag hidden-tag", "Hidden"));
  const src = el("a", "source-link", "Source: " + t.source_name);
  src.href = t.source_url;
  src.target = "_blank";
  src.rel = "noopener noreferrer";
  row.appendChild(src);
  return row;
}

function trophyCard(t) {
  const isEarned = earned.has(t.id);
  const locked = spoilerToggle.checked && t.hidden && !isEarned;
  const li = el("li", "trophy" + (isEarned ? " earned" : "") + (locked ? " locked" : ""));
  li.dataset.id = String(t.id);

  li.appendChild(gradeBadge(t));

  const main = el("div", "trophy-main");
  if (locked) {
    main.appendChild(el("h3", "trophy-name locked-name", "Hidden trophy"));
    main.appendChild(el("p", "locked-note", "This trophy stays hidden until you earn it. Tick the box when it pops and the name and guide will be revealed."));
  } else {
    main.appendChild(el("h3", "trophy-name", t.name));
    main.appendChild(el("p", "trophy-desc", t.description));
    main.appendChild(el("p", "trophy-guide", t.guide));
    main.appendChild(tagRow(t));
  }
  li.appendChild(main);

  const box = el("label", "earned-box");
  const check = el("input");
  check.type = "checkbox";
  check.checked = isEarned;
  check.setAttribute("aria-label", "Mark trophy earned");
  check.addEventListener("change", (ev) => {
    ev.stopPropagation();
    if (check.checked) earned.add(t.id); else earned.delete(t.id);
    saveEarned();
    render();
  });
  box.appendChild(check);
  box.appendChild(el("span", null, isEarned ? "Earned" : "Earn it"));
  li.appendChild(box);

  if (!locked) {
    li.addEventListener("click", (ev) => {
      if (ev.target.closest("a, input, label")) return;
      openDetail(t);
    });
  }
  return li;
}

function openDetail(t) {
  detailBody.textContent = "";
  detailBody.appendChild(gradeBadge(t));
  detailBody.appendChild(el("h3", null, t.name));
  detailBody.appendChild(el("p", "trophy-desc", t.description));
  detailBody.appendChild(el("p", "detail-guide", t.guide));
  detailBody.appendChild(tagRow(t));
  const earn = el("label", "toggle detail-earned");
  const check = el("input");
  check.type = "checkbox";
  check.checked = earned.has(t.id);
  check.addEventListener("change", () => {
    if (check.checked) earned.add(t.id); else earned.delete(t.id);
    saveEarned();
    render();
  });
  earn.appendChild(check);
  earn.appendChild(document.createTextNode(" Earned"));
  detailBody.appendChild(earn);
  dialog.showModal();
}

function visibleTrophies() {
  const q = searchInput.value.trim().toLowerCase();
  const grade = gradeFilter.value;
  return trophies.filter((t) => {
    if (activeKind === "missable" && !t.missable) return false;
    if (activeKind !== "all" && activeKind !== "missable" && t.kind !== activeKind) return false;
    if (grade !== "all" && t.grade !== grade) return false;
    if (earnedOnlyToggle.checked && !earned.has(t.id)) return false;
    if (remainingOnlyToggle.checked && earned.has(t.id)) return false;
    if (q) {
      const hay = (t.name + " " + t.description + " " + t.guide).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function render() {
  const shown = visibleTrophies();
  listEl.textContent = "";
  shown.forEach((t) => listEl.appendChild(trophyCard(t)));
  emptyEl.hidden = shown.length !== 0;
  resultsLine.textContent =
    shown.length + " of 55 trophies shown" +
    (earned.size ? " · " + earned.size + " earned" : "");

  const pct = Math.round((earned.size / 55) * 100);
  progressFill.style.width = pct + "%";
  earnedCountEl.textContent = String(earned.size);
  progressPctEl.textContent = pct + "%";
  platinumStateEl.textContent = earned.size === 55
    ? "platinum earned — Leonida Legend"
    : earned.has(1)
      ? "platinum earned"
      : "platinum not yet earned";

  [1, 2, 3].forEach((stage) => {
    const total = trophies.filter((t) => t.stage === stage).length;
    const got = trophies.filter((t) => t.stage === stage && earned.has(t.id)).length;
    const span = document.querySelector('[data-stage-count="' + stage + '"]');
    if (span) span.textContent = got + " / " + total;
  });
}

function exportProgress() {
  const payload = {
    game: "Grand Theft Auto VI",
    guide: "Leonida Trophy Guide",
    exported_at: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = el("a");
  a.href = url;
  a.download = "gta6-trophy-progress.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const ids = Array.isArray(parsed) ? parsed : parsed.earned;
      if (!Array.isArray(ids)) throw new Error("bad file");
      const next = new Set(ids.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
      earned = next;
      saveEarned();
      render();
    } catch {
      alert("That file is not a valid trophy-progress export.");
    }
  };
  reader.readAsText(file);
}

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    activeKind = chip.dataset.kind;
    render();
  });
});

searchInput.addEventListener("input", render);
gradeFilter.addEventListener("change", render);
spoilerToggle.addEventListener("change", render);
earnedOnlyToggle.addEventListener("change", render);
remainingOnlyToggle.addEventListener("change", render);
document.getElementById("exportBtn").addEventListener("click", exportProgress);
document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importFile").click();
});
document.getElementById("importFile").addEventListener("change", (ev) => {
  const file = ev.target.files && ev.target.files[0];
  if (file) importProgress(file);
  ev.target.value = "";
});
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Clear all earned trophies?")) {
    earned = new Set();
    saveEarned();
    render();
  }
});

fetch(DATA_URL)
  .then((res) => {
    if (!res.ok) throw new Error("trophies.json failed to load (" + res.status + ")");
    return res.json();
  })
  .then((data) => {
    trophies = data.trophies || [];
    earned = loadEarned();
    render();
  })
  .catch((err) => {
    listEl.textContent = "";
    emptyEl.hidden = false;
    emptyEl.textContent = "Could not load the trophy list: " + err.message;
  });
