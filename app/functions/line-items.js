import { state } from "./state.js";
import { recalc } from "./calculation.js";
import { debugLog } from "./utils.js";

export function addRow() {
  const id = state.rowCounter++;
  state.customRows.push(id);

  const row = document.createElement("div");
  row.className = "custom-line-row";
  row.id = `crow_${id}`;
  row.innerHTML = `
    <input
      class="custom-label-input"
      id="cname_${id}"
      type="text"
      placeholder="Item description…"
    />
    <div class="money-input-wrap" id="wrap-camount_${id}">
      <span class="money-prefix">$</span>
      <input
        class="money-input"
        id="camount_${id}"
        type="number"
        placeholder="0"
        oninput="window.recalc()"
      />
    </div>
    <button
      class="remove-row-btn"
      onclick="window.removeRow(${id})"
      title="Remove row"
      aria-label="Remove line item"
    >
      <svg viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  document.getElementById("customRows").appendChild(row);
  document.getElementById("cname_" + id).focus();
  debugLog("UI", `Added custom row ID: ${id}`);
  recalc();
}

export function removeRow(id) {
  const row = document.getElementById("crow_" + id);
  if (row) row.remove();
  state.customRows = state.customRows.filter((x) => x !== id);
  debugLog("UI", `Removed custom row ID: ${id}`);
  recalc();
}
