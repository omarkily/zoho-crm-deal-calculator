import { state } from "./state.js";
import { fmtMoney, debugLog } from "./utils.js";

export function toggleBill() {
  state._billOpen = !state._billOpen;
  const panel = document.getElementById("billPanel");
  const label = document.getElementById("billBtnLabel");

  if (panel) {
    if (state._billOpen) {
      panel.classList.remove("hidden");
      panel.classList.add("flex");
    } else {
      panel.classList.add("hidden");
      panel.classList.remove("flex");
    }
  }

  if (label) label.textContent = state._billOpen ? "Hide Bill" : "View Bill";
  debugLog("UI", `Toggled bill panel: ${state._billOpen ? "OPEN" : "CLOSED"}`);
  if (state._billOpen && !state._billLoaded) loadBill();
}

export function loadBill() {
  const vin = state.originalDeal?.VIN;
  if (!vin) {
    debugLog("ERROR", "Cannot load bill - No VIN on deal");
    document.getElementById("billContent").innerHTML =
      `<div class="bill-loading">No VIN found on deal.</div>`;
    return;
  }
  debugLog("CRM", `Fetching Books bill for VIN: ${vin}`);

  // Step 1: Search Zoho Books for bills matching this VIN as the bill number
  ZOHO.CRM.CONNECTION.invoke("zbooks", {
    url: `https://books.zoho.com/api/v3/bills?organization_id=YOUR_ZOHO_BOOKS_ORG_ID&bill_number=${encodeURIComponent(vin)}`,
    method: "GET",
    param_type: 1,
  })
    .then((searchResponse) => {
      let bills = null;
      try {
        if (searchResponse?.details?.statusMessage) {
          const msg = searchResponse.details.statusMessage;
          const parsed = typeof msg === "string" ? JSON.parse(msg) : msg;
          bills = parsed.bills;
        } else {
          bills = searchResponse?.bills;
        }
      } catch (_) {}

      if (!bills || bills.length === 0) {
        state._billLoaded = true;
        document.getElementById("billContent").innerHTML =
          `<div class="bill-loading">No bill found for VIN: ${vin}</div>`;
        return;
      }

      const billId = bills[0].bill_id;

      // Step 2: Fetch the full bill record using the resolved bill_id
      return ZOHO.CRM.CONNECTION.invoke("zbooks", {
        url: `https://books.zoho.com/api/v3/bills/${billId}?organization_id=YOUR_ZOHO_BOOKS_ORG_ID`,
        method: "GET",
        param_type: 1,
      });
    })
    .then((response) => {
      if (!response) return; // already handled (no bills found)
      state._billLoaded = true;
      let bill = parseBillResponse(response);
      if (!bill) {
        document.getElementById("billContent").innerHTML =
          `<div class="bill-loading">No bill data found.</div>`;
        return;
      }

      renderBill(bill);
    })
    .catch((e) => {
      document.getElementById("billContent").innerHTML =
        `<div class="bill-loading">Error loading bill: ${String(e)}</div>`;
    });
}

function parseBillResponse(response) {
  try {
    if (response?.details?.statusMessage) {
      const msg = response.details.statusMessage;
      const parsed = typeof msg === "string" ? JSON.parse(msg) : msg;
      return parsed.bill || parsed;
    }
    return response?.bill || response?.details?.bill;
  } catch (e) {
    return null;
  }
}

function renderBill(b) {
  let html = "";

  // Helper for section headers
  const getHeader = (title) => `
    <div class="p-[8px_14px] bg-brand-bg border-b border-brand-border text-[10px] font-bold tracking-[1.2px] uppercase text-brand-text-dim flex items-center gap-[6px] before:content-[''] before:inline-block before:w-[3px] before:h-[11px] before:bg-brand-blue before:rounded-[2px]">
      ${title}
    </div>`;

  // Helper for rows
  const getRow = (label, value) => `
    <div class="flex justify-between items-center p-[7px_14px] border-b border-brand-border last:border-b-0 text-[12px]">
      <span class="text-brand-text-dim">${label}</span>
      <span class="text-brand-text font-semibold font-mono">${value || "—"}</span>
    </div>`;

  // 1. Meta Section
  html +=
    '<div class="bg-brand-surface-2 border border-brand-border rounded-brand overflow-hidden">';
  html += getHeader("Bill details");
  html += getRow("Vendor", b.vendor_name);
  html += getRow("Bill #", b.bill_number);
  html += getRow("Bill Date", b.date);
  html += getRow("Due Date", b.due_date);
  html += getRow("Status", b.status);
  html += getRow("Currency", b.currency_code);
  html += "</div>";

  // 2. Line Items Section
  html +=
    '<div class="bg-brand-surface-2 border border-brand-border rounded-brand overflow-hidden">';
  html += getHeader("Line items");
  html += `
    <div class="grid grid-cols-[1fr_60px_110px_110px] gap-[8px] p-[6px_14px] border-b border-brand-border text-[10px] font-bold uppercase tracking-[0.8px] text-brand-text-dim">
      <span>Description</span><span class="text-right">Qty</span><span class="text-right">Rate</span><span class="text-right">Amount</span>
    </div>`;

  (b.line_items || []).forEach((line) => {
    html += `
    <div class="grid grid-cols-[1fr_40px_100px_100px] gap-[8px] p-[7px_14px] border-b border-brand-border last:border-b-0 text-[12px] hover:bg-brand-surface">
      <div class="text-brand-text-mid">
        ${line.name || line.description || "—"}`;

    // Taxes
    const taxes = line.line_item_taxes || [];
    taxes.forEach((lt) => {
      if (parseFloat(lt.tax_amount) > 0) {
        const pct = lt.tax_percentage || lt.tax_rate || lt.percentage || "";
        html += `<div class="text-[10px] text-brand-text-dim mt-[2px]">${lt.tax_name}${pct ? ` (${pct}%)` : ""}: ${fmtMoney(lt.tax_amount)}</div>`;
      }
    });
    if (taxes.length === 0 && line.tax_name && parseFloat(line.tax_amount) > 0) {
      html += `<div class="text-[10px] text-brand-text-dim mt-[2px]">${line.tax_name}: ${fmtMoney(line.tax_amount)}</div>`;
    }

    html += `
      </div>
      <div class="text-brand-text text-right font-mono">${parseFloat(line.quantity) || 1}</div>
      <div class="text-brand-text text-right font-mono">${fmtMoney(line.rate)}</div>
      <div class="text-brand-text text-right font-mono">${fmtMoney(line.item_total)}</div>
    </div>`;
  });
  html += "</div>";

  // 3. Summary Section
  html +=
    '<div class="bg-brand-surface-2 border border-brand-border rounded-brand overflow-hidden">';
  html += getHeader("Summary");
  html += getRow("Subtotal", fmtMoney(b.sub_total));
  if (parseFloat(b.tax_total) > 0) html += getRow("Total Tax", fmtMoney(b.tax_total));
  if (parseFloat(b.adjustment) !== 0) html += getRow("Adjustment", fmtMoney(b.adjustment));

  html += `
    <div class="flex justify-between items-center p-[7px_14px] border-b border-brand-border last:border-b-0 text-[12px] bg-brand-bg">
      <span class="text-brand-text-mid font-bold text-[13px]">Total</span>
      <span class="font-mono text-brand-gold font-semibold text-[15px]">${fmtMoney(b.total)}</span>
    </div>`;
  html += "</div>";

  document.getElementById("billContent").innerHTML = html;
}
