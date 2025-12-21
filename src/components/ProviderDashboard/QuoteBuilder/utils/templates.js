//levlpro-mvp\src\components\ProviderDashboard\QuoteBuilder\utils\templates.js

export const quoteTemplates = {
  handyman: {
    name: "Standard Handyman Quote",
    description: "General handyman services quote template",
    defaultLineItems: [
      {
        name: "Labor",
        description: "Standard hourly labor rate",
        type: "hourly",
        rate: 75,
        hours: 1,
      },
      {
        name: "Travel Fee",
        description: "One-time travel charge",
        type: "fixed",
        price: 25,
      },
    ],
    terms: `Payment Terms:
- 50% deposit required to schedule
- Final payment due upon completion
- Accepted payment methods: Cash, Check, Credit Card

Warranty:
- 90-day workmanship warranty
- Materials covered by manufacturer warranty

Disclaimer:
- Quote valid for 30 days
- Prices subject to change if scope changes
- Client responsible for permit fees if required`,
  },

  electrical: {
    name: "Electrical Work Quote",
    description: "Licensed electrical services",
    defaultLineItems: [
      {
        name: "Electrical Labor",
        description: "Licensed electrician hourly rate",
        type: "hourly",
        rate: 125,
        hours: 1,
      },
      {
        name: "Materials",
        description: "Electrical supplies and materials",
        type: "material",
        quantity: 1,
        unitPrice: 50,
      },
      {
        name: "Permit Fee",
        description: "Municipal electrical permit",
        type: "fixed",
        price: 150,
      },
    ],
    terms: `Payment Terms:
- 50% deposit required
- Final payment upon inspection approval

Licensing & Permits:
- Work performed by licensed electrician
- All work meets NEC code requirements
- Required permits included in quote

Warranty:
- 1-year workmanship warranty
- Materials warranted per manufacturer

Safety Notice:
- Power shut-off required during work
- Final inspection by local authority`,
  },

  assembly: {
    name: "Furniture Assembly Quote",
    description: "Furniture assembly services",
    defaultLineItems: [
      {
        name: "Assembly Labor",
        description: "Per item assembly",
        type: "fixed",
        price: 80,
      },
      {
        name: "Additional Items",
        description: "Each additional item",
        type: "fixed",
        price: 40,
      },
    ],
    terms: `Payment Terms:
- Payment due upon completion
- Cash, Venmo, or Credit Card accepted

Service Details:
- Assembly of customer-provided furniture
- Hardware and tools provided
- Cleanup of packaging materials included

Disclaimer:
- Quote valid for 14 days
- Client responsible for verifying all parts present
- Damage to pre-assembled items not covered`,
  },

  painting: {
    name: "Painting Quote",
    description: "Interior/exterior painting services",
    defaultLineItems: [
      {
        name: "Surface Preparation",
        description: "Cleaning, sanding, priming",
        type: "sqft",
        squareFeet: 100,
        ratePerSqft: 0.5,
      },
      {
        name: "Paint Application",
        description: "2 coats premium paint",
        type: "sqft",
        squareFeet: 100,
        ratePerSqft: 1.5,
      },
      {
        name: "Paint & Materials",
        description: "Premium interior paint",
        type: "material",
        quantity: 2,
        unitPrice: 45,
      },
    ],
    terms: `Payment Terms:
- 30% deposit upon acceptance
- 40% at project midpoint
- 30% upon completion

Surface Preparation:
- Light sanding and cleaning included
- Major repairs quoted separately
- Furniture moving by client

Paint Details:
- Premium quality paint
- 2 coats minimum
- Trim and doors included

Timeline:
- Weather dependent for exterior
- Estimated completion: [X] days`,
  },

  plumbing: {
    name: "Plumbing Services Quote",
    description: "Licensed plumbing services",
    defaultLineItems: [
      {
        name: "Plumbing Labor",
        description: "Licensed plumber hourly rate",
        type: "hourly",
        rate: 95,
        hours: 1,
      },
      {
        name: "Service Call Fee",
        description: "Trip charge and diagnosis",
        type: "fixed",
        price: 75,
      },
      {
        name: "Parts & Materials",
        description: "Plumbing fixtures and supplies",
        type: "material",
        quantity: 1,
        unitPrice: 100,
      },
    ],
    terms: `Payment Terms:
- Service call fee due at start
- Final payment upon completion

Licensing:
- Work performed by licensed plumber
- Meets local plumbing codes
- Permits obtained as required

Warranty:
- 90-day labor warranty
- Parts warranted per manufacturer

Important:
- Water shut-off may be required
- Access to work area must be clear
- Final inspection if required by code`,
  },

  hvac: {
    name: "HVAC Services Quote",
    description: "Heating and cooling services",
    defaultLineItems: [
      {
        name: "HVAC Labor",
        description: "Certified HVAC technician",
        type: "hourly",
        rate: 110,
        hours: 1,
      },
      {
        name: "Diagnostic Fee",
        description: "System inspection and diagnosis",
        type: "fixed",
        price: 95,
      },
      {
        name: "Parts",
        description: "HVAC components and materials",
        type: "material",
        quantity: 1,
        unitPrice: 150,
      },
    ],
    terms: `Payment Terms:
- Diagnostic fee due at service start
- Final payment upon completion

Service Details:
- Performed by certified technician
- EPA-certified refrigerant handling
- System testing after service

Warranty:
- 1-year labor warranty
- Parts warranty per manufacturer

Notice:
- System may be offline during service
- Filter replacement recommended
- Annual maintenance recommended`,
  },
};

export const getTemplate = (templateKey) => {
  return quoteTemplates[templateKey] || quoteTemplates.handyman;
};

export const getTemplateList = () => {
  return Object.entries(quoteTemplates).map(([key, template]) => ({
    key,
    name: template.name,
    description: template.description,
  }));
};