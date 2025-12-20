/* utils.js */

function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseIntList(raw) {
  if (!raw) return [];
  return raw
    .trim()
    .split(/[\s,]+/)
    .map(v => parseInt(v, 10))
    .filter(Number.isFinite);
}

function saveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadState(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function sortValues(a, b, asc = true) {
  if (typeof a === "number" && typeof b === "number") {
    return asc ? a - b : b - a;
  }
  const sa = String(a).toLowerCase();
  const sb = String(b).toLowerCase();
  if (sa < sb) return asc ? -1 : 1;
  if (sa > sb) return asc ? 1 : -1;
  return 0;
}

window.Utils = {
  escapeHTML,
  parseIntList,
  saveState,
  loadState,
  sortValues
};

