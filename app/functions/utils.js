export function getVal(id) {
  const el = document.getElementById(id);
  return el ? parseFloat(el.value) || 0 : 0;
}

export function fmt(v) {
  return (
    "$" +
    (parseFloat(v) || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function fmtMoney(v) {
  return fmt(v);
}

// ── Standard Toast System ──────────────────────────────────────────
let toastTimer = null;

export function showToast(message, type = "default") {
  const toast  = document.getElementById("toast");
  const msgEl  = document.getElementById("toast-msg");
  const iconEl = document.getElementById("toast-icon");
  if (!toast || !msgEl || !iconEl) return;

  msgEl.textContent = message;

  if (type === "success") {
    toast.className = "toast-success show";
    iconEl.innerHTML = `<polyline points="20 6 9 17 4 12"/>`;
  } else if (type === "error") {
    toast.className = "toast-error show";
    iconEl.innerHTML = `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`;
  } else {
    toast.className = "show";
    iconEl.innerHTML = `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`;
  }

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── Loading overlay ────────────────────────────────────────────────
export function showOverlay(visible) {
  document.getElementById("loading-overlay")?.classList.toggle("hidden", !visible);
}

// ── Debug logger ───────────────────────────────────────────────────
export function debugLog(category, msg, data = null) {
  const colors = {
    CRM:   "#2563eb", // blue
    CALC:  "#059669", // emerald
    UI:    "#7c3aed", // violet
    ERROR: "#991b1b", // red
  };
  const color = colors[category] || "#64748b";
  console.log(
    `%c[${category}] %c${msg}`,
    `color: ${color}; font-weight: bold;`,
    "color: inherit;",
    data !== null ? data : ""
  );
}
