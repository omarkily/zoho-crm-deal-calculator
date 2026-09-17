import { state } from "./state.js";
import { recalc, recalcFees } from "./calculation.js";
import { showToast, debugLog } from "./utils.js";

// ─────────────────────────────────────────────────────────────────
// SKELETON HELPERS
// Each input lives inside a wrapper div with id="wrap-{fieldId}"
// We add/remove .field-skeleton on that wrapper.
// ─────────────────────────────────────────────────────────────────

/** Put an input field's wrapper into skeleton/shimmer state. */
function showSkeleton(id) {
  const wrap = document.getElementById("wrap-" + id);
  const el = document.getElementById(id);
  if (!wrap || !el) return;
  wrap.classList.add("field-skeleton");
  el.value = "";
  el.disabled = true;
}

/** Remove skeleton from an input and set its value. */
function clearSkeleton(id, val) {
  const wrap = document.getElementById("wrap-" + id);
  const el = document.getElementById(id);
  if (!wrap || !el) return;
  wrap.classList.remove("field-skeleton");
  el.disabled = false;
  el.value = parseFloat(val) || 0;
}

/** Put every quote input into skeleton state at once. */
const ALL_FIELDS = [
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

function showAllSkeletons() {
  ALL_FIELDS.forEach(showSkeleton);
}

// ─────────────────────────────────────────────────────────────────
// FIELD SETTERS / POPULATORS
// ─────────────────────────────────────────────────────────────────

export function setField(id, val) {
  clearSkeleton(id, val);
}

/**
 * Populate all widget inputs from a computed data object.
 * Clears any remaining skeletons (used for doReset).
 */
export function populateFields(computed) {
  clearSkeleton("vehiclePrice", computed.vehicle_sale_price);
  clearSkeleton("serviceFee", computed.service_fee);
  clearSkeleton("damageFund", computed.damage_fund);
  clearSkeleton("inlandShipping", computed.inland_shipping);
  clearSkeleton("oceanShipping", computed.ocean_shipping);
  clearSkeleton("insurance", computed.insurance);
  clearSkeleton("offsiteSurcharge", computed.offsite_surcharge);
  clearSkeleton("dgSurcharge", computed.dg_surcharge);
  clearSkeleton("taxSurcharge", computed.tax_surcharge);
  clearSkeleton("titleFee", computed.title_fee);
  clearSkeleton("salesCommission", computed.salesperson_commission);

  // Show/hide Canada-only rows
  const isCanada = computed.origin === "Canada";
  const taxRow = document.getElementById("row_tax");
  const titleRow = document.getElementById("row_title");
  if (taxRow) taxRow.style.display = isCanada ? "grid" : "none";
  if (titleRow) titleRow.style.display = isCanada ? "grid" : "none";

  // DG sub-label
  const dgSub = document.getElementById("dgSub");
  if (dgSub) dgSub.style.display = computed.is_dg ? "block" : "none";

  recalcFees();

  // Inland source description
  const inlandSub = document.getElementById("inlandSub");
  if (inlandSub) inlandSub.textContent = computed.inland_source || "—";

  // Ocean / port / size labels
  const port = computed.loading_port || "";
  const size = computed.vehicle_size || "";

  const oceanSub = document.getElementById("oceanSub");
  if (oceanSub) oceanSub.textContent = port && size ? port + " · " + size : "—";

  const portDisplay = document.getElementById("portDisplay");
  if (portDisplay) portDisplay.textContent = port ? "Port: " + port : "—";

  const sizeDisplay = document.getElementById("sizeDisplay");
  if (sizeDisplay) sizeDisplay.textContent = size || "—";

  recalc();
}

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

/** Round a number up to the nearest multiple of 10 (mirrors .dg logic). */
function roundUpTo10(val) {
  const rem = val % 10;
  return rem === 0 ? val : val + 10 - rem;
}

/** Safe ZOHO CRM search — returns data array or [] on any error. */
async function crmSearch(entity, criteria) {
  try {
    const resp = await ZOHO.CRM.API.searchRecord({
      Entity: entity,
      Type: "criteria",
      Query: criteria,
    });
    return resp?.data || [];
  } catch (_) {
    return [];
  }
}

/** Safe ZOHO CRM getRecord — returns record object or null on any error. */
async function crmGet(entity, recordId) {
  debugLog("CRM", `Fetching ${entity}: ${recordId}`);
  try {
    const resp = await ZOHO.CRM.API.getRecord({
      Entity: entity,
      RecordID: recordId,
    });
    if (!resp?.data?.[0]) {
      debugLog("CRM", `Empty response for ${entity}: ${recordId}`);
    } else {
      debugLog(
        "CRM",
        `Successfully fetched ${entity}: ${recordId}`,
        resp.data[0],
      );
    }
    return resp?.data?.[0] || null;
  } catch (e) {
    debugLog("ERROR", `Failed to fetch ${entity}: ${recordId}`, e);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────
// MAIN LOAD — mirrors calculate_deal_quote.dg section by section
// Each await resolves one group of fields; skeletons clear as they land.
// ─────────────────────────────────────────────────────────────────

export async function loadRecord(id) {
  // Always store deal ID as String
  id = String(id);
  debugLog("CRM", `Starting loadRecord for Deal ID: ${id}`);
  try {
    // ── §1: Deal record ──────────────────────────────────────────
    const deal = await crmGet("Deals", id);
    if (!deal) {
      debugLog("ERROR", "Deal record not found");
      document.getElementById("loadMsg").textContent = "No data returned";
      return;
    }
    debugLog("CRM", "Deal record loaded", deal);
    if (!deal.Vehicle || !deal.Vehicle.id) {
      const loadMsg = document.getElementById("loadMsg");
      if (loadMsg) {
        loadMsg.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:20px 16px;text-align:center">
            <div style="width:48px;height:48px;background:#fef2f2;border-radius:12px;display:flex;align-items:center;justify-content:center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div style="font-size:14px;font-weight:700;color:#dc2626">Vehicle Missing</div>
            <div style="font-size:13px;color:var(--slate-500);line-height:1.5">This deal is not linked to a vehicle.<br/>Please select a vehicle in the Deal record.</div>
            <button onclick="window.location.reload()" style="font-size:13px;font-weight:600;color:var(--blue-600);background:none;border:none;cursor:pointer;text-decoration:underline">Retry after linking</button>
          </div>
        `;
      }
      return;
    }

    const vehicle = await crmGet("Products", deal.Vehicle.id);

    // Set vehicle in state for global access
    state.vehicle = vehicle;
    state.originalDeal = deal;

    // ── §1.1: Location record ────────────────────────────────────
    if (!vehicle.Location1 || !vehicle.Location1.id) {
      const loadMsg = document.getElementById("loadMsg");
      if (loadMsg) {
        loadMsg.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:20px 16px;text-align:center">
            <div style="width:48px;height:48px;background:#fef2f2;border-radius:12px;display:flex;align-items:center;justify-content:center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div style="font-size:14px;font-weight:700;color:#dc2626">Location Missing</div>
            <div style="font-size:13px;color:var(--slate-500);line-height:1.5">The vehicle is not linked to a location (Location1).<br/>Please set a location in the Vehicle record.</div>
            <button onclick="window.location.reload()" style="font-size:13px;font-weight:600;color:var(--blue-600);background:none;border:none;cursor:pointer;text-decoration:underline">Retry after fixing</button>
          </div>
        `;
      }
      return;
    }

    const location = await crmGet("Inland_Rates", String(vehicle.Location1.id));
    if (!location) {
      const loadMsg = document.getElementById("loadMsg");
      if (loadMsg) {
        loadMsg.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:20px 16px;text-align:center">
            <div style="width:48px;height:48px;background:#fef2f2;border-radius:12px;display:flex;align-items:center;justify-content:center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div style="font-size:14px;font-weight:700;color:#dc2626">Location Not Found</div>
            <div style="font-size:13px;color:var(--slate-500);line-height:1.5">The linked location (ID: ${vehicle.Location1.id}) was not found in Inland Rates.</div>
            <button onclick="window.location.reload()" style="font-size:13px;font-weight:600;color:var(--blue-600);background:none;border:none;cursor:pointer;text-decoration:underline">Try again</button>
          </div>
        `;
      }
      return;
    }
    debugLog("CRM", "Location record loaded", location);
    state.location = location;

    // ── §1.2: Vendor & Account records ────────────────────────────
    const vendorId = deal.Vendor_Name?.id || "";
    const vendor = vendorId ? await crmGet("Vendors", vendorId) : null;
    if (vendor) debugLog("CRM", "Vendor record loaded", vendor);

    const accountId = deal.Account_Name?.id || "";
    const account = accountId ? await crmGet("Accounts", accountId) : null;
    if (account) debugLog("CRM", "Account record loaded", account);

    // Show the app frame and immediately skeleton all fields
    const loadingEl = document.getElementById("loading");
    const appEl = document.getElementById("app");
    if (loadingEl) loadingEl.style.display = "none";
    if (appEl) appEl.style.display = "block";
    showAllSkeletons();

    // ── Populate deal header (instant — no extra fetch needed) ───
    const dealNameSub = document.getElementById("deal-name-sub");
    if (dealNameSub) dealNameSub.textContent = deal.Deal_Name || "Deal";

    const vinDisplayEl = document.getElementById("vinDisplay");
    if (vinDisplayEl) vinDisplayEl.textContent = "VIN: " + (deal.VIN || "—");

    let origin = location.Location_Country_Region || "";
    if (origin === "United States") origin = "USA";

    const badge = document.getElementById("originBadge");
    if (badge) {
      badge.textContent = origin || "—";
      badge.style.display = origin ? "" : "none";
      badge.className =
        "header-badge " + (origin === "Canada" ? "badge-canada" : "badge-usa");
    }

    const deal_currency = deal.Currency || "";
    const currBadgeEl = document.getElementById("currBadge");
    if (currBadgeEl) {
      currBadgeEl.textContent = deal_currency || "";
      currBadgeEl.style.display = deal_currency ? "" : "none";
    }

    // Books bill button (Books_Bill_ID is NOT in the deleted-fields list)
    const billId = deal.Books_Bill_ID || "";
    if (billId) {
      state._billId = billId;
      const billBtn = document.getElementById("billBtn");
      if (billBtn) billBtn.style.display = "inline-flex";
    }

    // Show/hide Canada rows early (so layout doesn't jump later)
    const isCanada = origin === "Canada";
    const taxRow = document.getElementById("row_tax");
    const titleRow = document.getElementById("row_title");
    if (taxRow) taxRow.style.display = isCanada ? "grid" : "none";
    if (titleRow) titleRow.style.display = isCanada ? "grid" : "none";

    // ── Raw deal input values ────────────────────────────────────
    // ── Data from source records (instead of Deal) ───────────────
    const vendor_type = vendor?.Vendor_Type || "";
    let loading_port = location?.Port?.name || ""; // Port is a lookup field
    const vehicle_size = vehicle?.Vehicle_Size_Category || "";
    const province = location?.Location_State_Province || "";
    let is_dg = vehicle?.DG_Status === "DG";

    // ── Remaining Deal-level fields ───────────────────────────────
    const is_offsite = deal.Vehicle_Is_Offsite || false;
    const manual_inland = parseFloat(deal.Inland_Shipping_Manual) || 0;
    const include_insurance = deal.Include_Insurance || false;
    const use_standard = deal.Use_Standard_Pricing !== false; // default true
    const salesperson_name = deal.Salesperson_Name || "None";
    const account_id = deal.Account_Name?.id || "";

    // ── §3+4: Vehicle → sale price + DG ─────────────────────────
    // vehiclePrice skeleton clears here
    let vehicle_sale_price = roundUpTo10(
      parseFloat(state.vehicle.Purchase_Price) || 0,
    );

    // Also check Electrification Level as fallback for DG
    const elec = vehicle?.Electrification_Level || "";
    // if (elec && elec !== "Non-Electrified") is_dg = true;

    clearSkeleton("vehiclePrice", vehicle_sale_price);

    // ── §5: Pricing_Config globals ───────────────────────────────
    // damageFund skeleton clears here (first field that depends on globals)

    let inland_markup = 20;
    let damage_fund = 20;
    let offsite_amount = 100;
    let dg_amount = 200;
    let insurance_rate = 0.02;

    const globals = await crmSearch(
      "Pricing_Config",
      "(Record_Type:equals:Global_Setting)",
    );
    debugLog("CRM", `Found ${globals.length} global config records`);
    globals.forEach((cfg) => {
      const key = cfg.Key_1 || "";
      const key2 = cfg.Key_2 || "";
      const amt = parseFloat(cfg.Amount) || 0;
      if (key === "Inland_Markup") inland_markup = amt;
      else if (key === "Damage_Fund") damage_fund = amt;
      else if (key === "Offsite_Surcharge") offsite_amount = amt;
      else if (key === "Insurance_Rate_Pct") insurance_rate = amt / 100;
      else if (key === "DG_Surcharge" && key2 === origin) dg_amount = amt;
    });
    clearSkeleton("damageFund", damage_fund);

    // ── §5 cont.: Title fee (Canada + province) ──────────────────
    let title_fee = 0;
    if (origin === "Canada" && province) {
      const tfRows = await crmSearch(
        "Pricing_Config",
        `((Record_Type:equals:Title_Fee) and (Key_1:equals:${province}))`,
      );
      if (tfRows[0]) title_fee = parseFloat(tfRows[0].Amount) || 0;
    }
    clearSkeleton("titleFee", title_fee);

    // ── §6: Service fee ──────────────────────────────────────────
    let service_fee = origin === "Canada" ? 350 : 300;
    let client_pricing = [];

    const sfRows = await crmSearch(
      "Pricing_Config",
      `((Record_Type:equals:Service_Fee) and (Key_1:equals:${origin}) and (Key_2:equals:${vendor_type}))`,
    );

    if (sfRows[0]) service_fee = parseFloat(sfRows[0].Amount) || service_fee;

    const coqlConfig = {
      select_query: `select Amount, Comments, Deals, Client_Pricing, Client_Pricing.Name, Client_Pricing.Record_Type from Deals_Client_Pricing where Deals.id = '${id}'`,
    };
    const cpResp = await ZOHO.CRM.API.coql(coqlConfig);
    client_pricing = cpResp.data || [];

    if (!use_standard) {
      // Check for Service_Fee override in COQL results
      for (const rec of client_pricing) {
        if (rec["Client_Pricing.Record_Type"] === "Service_Fee") {
          const acct_sf = parseFloat(rec.Amount) || 0;
          if (acct_sf > 0) service_fee = acct_sf;
        }
      }
    }

    clearSkeleton("serviceFee", service_fee);

    //
    let offsite_surcharge = 0;
    for (const rec of client_pricing) {
      console.log(rec);

      if (
        rec["Client_Pricing.Record_Type"] === "Surcharge" &&
        rec["Client_Pricing.Name"].includes("Offsite")
      ) {
        offsite_surcharge = parseFloat(rec.Amount) || 0;
      }
    }

    clearSkeleton("offsiteSurcharge", offsite_surcharge);

    //

    // ── §6 cont.: Salesperson commission ─────────────────────────

    let salesperson_commission = 0;
    for (const rec of client_pricing) {
      console.log(rec);

      if (rec["Client_Pricing.Record_Type"] === "Salesperson_Commission") {
        salesperson_commission = parseFloat(rec.Amount) || 0;
      }
    }

    clearSkeleton("salesCommission", salesperson_commission);

    // ── §7: Vehicle size tier (local computation) ────────────────
    let size_tier = "Standard";

    const baseVehicleTypes = [
      "Sedan",
      "SUV (Standard)",
      "Van (Standard)",
      "Pickup Truck (Standard)",
      "MUV",
      "Golf Cart",
      "Snowmobile",
      "Jet Ski",
    ];
    const smallVehicleTypes = ["Motorcycle", "ATV", "Lawn Mower"];
    const largeVehicleTypes = ["SUV (Large)", "Pickup Truck (Large)"];
    const oversizedVehicleTypes = ["Van (Large)", "Pickup Truck (Oversized)"];

    let inland_shipping = parseFloat(location.Rate) || 0;

    if (smallVehicleTypes.includes(vehicle_size)) {
      inland_shipping = location.Small_Rate;
    } else if (largeVehicleTypes.includes(vehicle_size)) {
      inland_shipping = location.Large_Rate;
    } else if (oversizedVehicleTypes.includes(vehicle_size)) {
      inland_shipping = location.Oversized_Rate;
    }

    // ── §8: Inland shipping ──────────────────────────────────────
    let inland_source = "Inland Rate (" + (location.Name || "Unknown") + ")";

    if (inland_shipping === 0 && manual_inland > 0) {
      inland_shipping = manual_inland;
      inland_source = "Manual entry";
    }

    clearSkeleton("inlandShipping", inland_shipping);
    const inlandSub = document.getElementById("inlandSub");
    if (inlandSub) inlandSub.textContent = inland_source || "—";

    // Port / size display labels
    const portDisplay = document.getElementById("portDisplay");
    if (portDisplay)
      portDisplay.textContent = loading_port ? "Port: " + loading_port : "—";
    const sizeDisplay = document.getElementById("sizeDisplay");
    if (sizeDisplay) sizeDisplay.textContent = vehicle_size || "—";

    // ── §9: Ocean type + ocean shipping ─────────────────────────
    let ocean_type = "Standard";
    if (origin === "Canada") {
      if (size_tier === "Large") ocean_type = "Oversized";
      else if (size_tier === "Oversized") ocean_type = "Pickup";
    } else {
      if (size_tier === "Large") ocean_type = "Pickup";
      else if (size_tier === "Oversized") ocean_type = "Oversized";
    }

    let ocean_shipping = 0;
    if (!use_standard && client_pricing.length > 0) {
      // Check for Ocean_Rate override in COQL results
      for (const rec of client_pricing) {
        if (rec["Client_Pricing.Record_Type"] === "Ocean_Rate") {
          const acct_ocn = parseFloat(rec.Amount) || 0;
          if (acct_ocn > 0) ocean_shipping = acct_ocn;
        }
      }
    }

    if (ocean_shipping === 0) {
      const ocnRows = await crmSearch(
        "Pricing_Config",
        `((Record_Type:equals:Ocean_Rate) and (Key_1:equals:${origin}) and (Key_2:equals:${loading_port}) and (Key_3:equals:${ocean_type}))`,
      );
      if (ocnRows[0]) ocean_shipping = parseFloat(ocnRows[0].Amount) || 0;
    }

    clearSkeleton("oceanShipping", ocean_shipping);
    const oceanSub = document.getElementById("oceanSub");
    if (oceanSub)
      oceanSub.textContent =
        loading_port && vehicle_size
          ? loading_port + " · " + vehicle_size
          : "—";

    // ── §10: Surcharges (local computation — clear all at once) ──
    // tax_surcharge: from Books bill tax_total — Books API not callable from
    // widget JS, so stays 0 and user can adjust manually if needed.
    const tax_surcharge = 0;
    let insurance = 0;
    const clientInsuranceRecord = client_pricing.find((rec) => {
      const cpName = rec["Client_Pricing.Name"] || "";
      return cpName.toLowerCase().includes("insurance");
    });

    if (clientInsuranceRecord) {
      insurance = Math.ceil(parseFloat(clientInsuranceRecord.Amount) || 0);
    } else if (include_insurance) {
      insurance = Math.ceil(vehicle_sale_price * insurance_rate);
    }
    const dg_surcharge = is_dg ? dg_amount : 0;

    clearSkeleton("taxSurcharge", tax_surcharge);
    clearSkeleton("insurance", insurance);
    clearSkeleton("dgSurcharge", dg_surcharge);

    // DG sub-label
    const dgSub = document.getElementById("dgSub");
    if (dgSub) dgSub.style.display = is_dg ? "block" : "none";

    // ── Store & trigger final recalc ─────────────────────────────
    const computed = {
      vehicle_sale_price,
      service_fee,
      damage_fund,
      inland_shipping,
      inland_source,
      ocean_shipping,
      insurance,
      offsite_surcharge,
      dg_surcharge,
      tax_surcharge,
      title_fee,
      salesperson_commission,
      origin,
      loading_port,
      vehicle_size,
      is_dg,
    };

    state.computedData = computed;
    debugLog("CALC", "Finished computing record data", computed);
    recalcFees();
    recalc();
  } catch (e) {
    const loadMsg = document.getElementById("loadMsg");
    if (loadMsg) {
      loadMsg.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:20px 16px;text-align:center">
          <div style="width:48px;height:48px;background:#fef2f2;border-radius:12px;display:flex;align-items:center;justify-content:center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <div style="font-size:14px;font-weight:700;color:#dc2626">API Error</div>
          <div style="font-size:12px;color:var(--slate-500);word-break:break-all;max-width:280px">${e}</div>
          <button onclick="window.location.reload()" style="font-size:13px;font-weight:600;color:var(--blue-600);background:none;border:none;cursor:pointer;text-decoration:underline">Try again</button>
        </div>
      `;
    }
    debugLog("ERROR", "loadRecord failed", e);
  }
}

// ─────────────────────────────────────────────────────────────────
// RESET
// ─────────────────────────────────────────────────────────────────

export function doReset() {
  state.customRows = [];
  state.rowCounter = 0;
  document.getElementById("customRows").innerHTML = "";
  if (state.computedData) populateFields(state.computedData);
  showToast("Reset to computed values", "success");
}

// ─────────────────────────────────────────────────────────────────
// CLOSE
// ─────────────────────────────────────────────────────────────────

export function doRefresh() {
  try {
    ZOHO.CRM.UI.Popup.close();
  } catch (e) {}
}
