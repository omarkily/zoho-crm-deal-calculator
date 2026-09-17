export const state = {
  dealId: null,
  originalDeal: {},
  originalVehicle: null, // Keep null by default to signal it's missing
  originalLocation: null,
  /** Computed quote values derived from deal + pricing config. */
  computedData: null,
  customRows: [],
  rowCounter: 0,
  _billLoaded: false,
  _billOpen: false,
  _billId: null,

  // Helper functions for easier access
  get vehicle() {
    return this.originalVehicle;
  },

  set vehicle(v) {
    this.originalVehicle = v;
  },

  get location() {
    return this.originalLocation;
  },

  set location(l) {
    this.originalLocation = l;
  },

  hasVehicle() {
    return this.originalVehicle !== null && typeof this.originalVehicle === "object";
  },
};
