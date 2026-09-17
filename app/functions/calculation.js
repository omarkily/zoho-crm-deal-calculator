import { state } from "./state.js";
import { getVal, fmt, debugLog } from "./utils.js";

const STANDARD_FEE_FIELDS = [
  "serviceFee",
  "damageFund",
  "taxSurcharge",
  "salesCommission",
];

const ALL_QUOTE_FIELDS = [
  "vehiclePrice",
  "serviceFee",
  "damageFund",
  "inlandShipping",
  "oceanShipping",
  "insurance",
  "offsiteSurcharge",
  "dgSurcharge",
  "taxSurcharge",
  "titleFee",
  "salesCommission",
];

export function recalcFees() {
  const feeTotal = STANDARD_FEE_FIELDS.reduce((sum, id) => sum + getVal(id), 0);
  debugLog("CALC", "Recalculating core fees", { fields: STANDARD_FEE_FIELDS, total: feeTotal });
  const el = document.getElementById("serviceFeeTotal");
  if (el) el.textContent = fmt(feeTotal);
  recalc();
}

export function recalc() {
  const baseTotal = ALL_QUOTE_FIELDS.reduce((sum, id) => sum + getVal(id), 0);

  const customTotal = state.customRows.reduce((sum, id) => {
    const el = document.getElementById("camount_" + id);
    const val = parseFloat(el?.value) || 0;
    return sum + val;
  }, 0);

  const finalTotal = baseTotal + customTotal;
  debugLog("CALC", "Total recalc", { baseTotal, customTotal, finalTotal });

  // Update total display
  const tv = document.getElementById("totalVal");
  if (tv) {
    tv.textContent = fmt(finalTotal);
    tv.classList.add("bump");
    setTimeout(() => tv.classList.remove("bump"), 220);
  }

  // Handle custom subtotal row visibility
  const subRow = document.getElementById("customSubRow");
  if (subRow) subRow.style.display = customTotal > 0 ? "flex" : "none";

  const subVal = document.getElementById("customSubVal");
  if (subVal) subVal.textContent = fmt(customTotal);
}
