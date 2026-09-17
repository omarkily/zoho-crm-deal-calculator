import { state } from "./functions/state.js";
import { recalc, recalcFees } from "./functions/calculation.js";
import { addRow, removeRow } from "./functions/line-items.js";
import { loadRecord, doReset, doRefresh } from "./functions/crm.js";
import { toggleBill } from "./functions/bill.js";
import { showToast } from "./functions/utils.js";

// Expose functions to window for HTML onclick handlers
window.recalc     = recalc;
window.recalcFees = recalcFees;
window.addRow     = addRow;
window.removeRow  = removeRow;
window.doReset    = doReset;
window.doRefresh  = doRefresh;
window.toggleBill = toggleBill;
window.showToast  = showToast;

// ── Zoho CRM Initialization ─────────────────────────────────────────
ZOHO.embeddedApp.on("PageLoad", function (data) {
  // Robust EntityId extraction (matches theme-standard §16)
  const idValue = data?.EntityId || data?.[0]?.EntityId || data?.id || data?.[0]?.id;
  const dealId  = idValue ? String(idValue) : null;

  if (dealId) {
    state.dealId = dealId;
    loadRecord(dealId);
  } else {
    const loadMsg = document.getElementById("loadMsg");
    if (loadMsg) loadMsg.textContent = "Invalid context: No Deal ID found.";
  }
});

ZOHO.embeddedApp.init();
