//levlpro-mvp\src\components\ProviderDashboard\QuoteBuilder\utils\quoteCalculations.js

/**
 * Calculate line item total
 */
export const calculateLineItemTotal = (item, settings = {}) => {
  let subtotal = 0;

  if (item.type === "hourly") {
    subtotal = item.hours * item.rate;
  } else if (item.type === "fixed") {
    subtotal = item.price;
  } else if (item.type === "sqft") {
    subtotal = item.squareFeet * item.ratePerSqft;
  } else if (item.type === "material") {
    subtotal = item.quantity * item.unitPrice;
    // Apply material markup
    if (settings.materialMarkup) {
      subtotal *= 1 + settings.materialMarkup / 100;
    }
  }

  return Math.round(subtotal * 100) / 100; // Round to 2 decimals
};

/**
 * Calculate quote subtotal
 */
export const calculateSubtotal = (lineItems, settings) => {
  return lineItems.reduce((sum, item) => {
    return sum + calculateLineItemTotal(item, settings);
  }, 0);
};

/**
 * Calculate tax
 */
export const calculateTax = (subtotal, taxRate) => {
  return Math.round(subtotal * (taxRate / 100) * 100) / 100;
};

/**
 * Calculate total with all fees and adjustments
 */
export const calculateQuoteTotal = (lineItems, settings) => {
  let subtotal = calculateSubtotal(lineItems, settings);

  // Apply travel fee
  if (settings.travelFee) {
    subtotal += settings.travelFee;
  }

  // Apply minimum charge
  if (settings.minimumCharge && subtotal < settings.minimumCharge) {
    subtotal = settings.minimumCharge;
  }

  // Calculate tax
  const tax = settings.taxRate ? calculateTax(subtotal, settings.taxRate) : 0;

  // Total
  const total = subtotal + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

/**
 * Calculate profit margin
 */
export const calculateProfitMargin = (lineItems, settings) => {
  const laborCost = lineItems
    .filter((item) => item.type === "hourly")
    .reduce((sum, item) => sum + item.hours * item.rate, 0);

  const materialCost = lineItems
    .filter((item) => item.type === "material")
    .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const { total } = calculateQuoteTotal(lineItems, settings);

  const profit = total - laborCost - materialCost;
  const profitMargin = total > 0 ? (profit / total) * 100 : 0;

  return {
    laborCost: Math.round(laborCost * 100) / 100,
    materialCost: Math.round(materialCost * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    profitMargin: Math.round(profitMargin * 100) / 100,
  };
};

/**
 * Round labor hours based on settings
 */
export const roundLaborHours = (hours, roundingRule = "0.5") => {
  const rule = parseFloat(roundingRule);
  return Math.ceil(hours / rule) * rule;
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Validate quote for common issues
 */
export const validateQuote = (quote, settings) => {
  const warnings = [];
  const errors = [];

  // Check if quote has line items
  if (!quote.lineItems || quote.lineItems.length === 0) {
    errors.push("Quote must have at least one line item");
  }

  // Check for missing descriptions
  const missingDescriptions = quote.lineItems?.filter((item) => !item.description);
  if (missingDescriptions?.length > 0) {
    warnings.push(`${missingDescriptions.length} line items missing descriptions`);
  }

  // Check if quote is below minimum
  const { total } = calculateQuoteTotal(quote.lineItems || [], settings);
  if (settings.minimumCharge && total < settings.minimumCharge) {
    warnings.push(`Quote total ($${total}) is below minimum charge ($${settings.minimumCharge})`);
  }

  // Check if quote is unusually high
  if (total > 10000) {
    warnings.push("Quote exceeds $10,000 - consider breaking into phases");
  }

  // Check profit margin
  const { profitMargin } = calculateProfitMargin(quote.lineItems || [], settings);
  if (profitMargin < 15) {
    warnings.push(`Low profit margin (${profitMargin.toFixed(1)}%)`);
  } else if (profitMargin > 50) {
    warnings.push(`High profit margin (${profitMargin.toFixed(1)}%) - may lose to competitors`);
  }

  return { errors, warnings, isValid: errors.length === 0 };
};