/**
 * Riverside Plumbing LLC — fictional sample client used across every document
 * mockup in the "What Lands in Your Inbox" section.
 *
 * Every figure below is internally consistent: the P&L foots, the balance sheet
 * balances, the AR aging buckets sum to the receivable total, and the insights
 * quote numbers that appear elsewhere in the pack. Nothing here is lorem ipsum.
 */

export const client = {
  name: "Riverside Plumbing LLC",
  location: "Paramus, New Jersey",
  period: "For the month ended July 31, 2026",
  periodShort: "July 2026",
  delivered: "Delivered Friday, August 7, 2026 — business day 5",
  bank: "Valley National Bank ····4471",
};

export const usd = (n, { cents = false } = {}) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });

/** Parenthesised negatives, the way accountants write them. */
export const acct = (n) => (n < 0 ? `(${usd(-n)})` : usd(n));

/* ---------------------------------------------------------------- P&L ---- */

export const pnl = {
  revenue: [
    ["Service calls & repairs", 128450, 842100],
    ["New installations", 86200, 548600],
    ["Maintenance contracts", 24800, 171200],
    ["Emergency / after-hours", 18940, 122300],
  ],
  revenueTotal: [258390, 1684200],
  cogs: [
    ["Materials & parts", 71340, 462400],
    ["Subcontracted labor", 22150, 148900],
    ["Field labor & burden", 63880, 419700],
    ["Vehicle & fuel", 9420, 61300],
  ],
  cogsTotal: [166790, 1092300],
  grossProfit: [91600, 591900],
  grossMargin: ["35.5%", "35.1%"],
  opex: [
    ["Salaries & wages — office", 28400, 172600],
    ["Payroll taxes & benefits", 11260, 68400],
    ["Insurance — general liability & auto", 6180, 43260],
    ["Merchant & card processing fees", 7090, 42180],
    ["Advertising & lead generation", 5940, 44150],
    ["Rent & utilities", 4350, 30450],
    ["Software & dispatch", 1880, 13160],
    ["Professional fees", 1450, 8900],
    ["Repairs & maintenance", 2210, 13400],
    ["Other operating", 1640, 10900],
  ],
  opexTotal: [70400, 447400],
  operatingIncome: [21200, 144500],
  interest: [1880, 13100],
  netIncome: [19320, 131400],
  netMargin: ["7.5%", "7.8%"],
};

/* ------------------------------------------------------ Balance sheet ---- */

export const balanceSheet = {
  asOf: "As of July 31, 2026",
  currentAssets: [
    ["Operating cash — Valley National ····4471", 231800],
    ["Accounts receivable", 38400],
    ["Inventory — parts & fixtures", 46250],
    ["Prepaid insurance", 5400],
  ],
  currentAssetsTotal: 321850,
  fixedAssets: [
    ["Vehicles & equipment, at cost", 268900],
    ["Less: accumulated depreciation", -112470],
  ],
  fixedAssetsTotal: 156430,
  assetsTotal: 478280,
  currentLiabilities: [
    ["Accounts payable", 52180],
    ["Credit cards payable", 14320],
    ["Payroll liabilities", 9640],
    ["Current portion — vehicle loans", 28800],
  ],
  currentLiabilitiesTotal: 104940,
  longTerm: [["Vehicle & equipment loans, net of current", 96340]],
  liabilitiesTotal: 201280,
  equity: [
    ["Member's capital", 92000],
    ["Retained earnings", 53600],
    ["Current year earnings", 131400],
  ],
  equityTotal: 277000,
  liabilitiesAndEquityTotal: 478280,
};

/* --------------------------------------------------- Five insights ------- */

export const insights = [
  {
    rank: 1,
    tag: "Worth ≈ $12,200 a year",
    tone: "gold",
    headline: "Your card fees grew 19% while revenue grew 8%.",
    body: "You paid $7,090 in processing in July against $5,958 in June — an effective rate of 2.74%. Market for your volume and mix is about 2.35%.",
    action:
      "Do this: call Heartland and ask to be re-priced to interchange-plus 0.30% + $0.10. We've drafted the script and your last six statements are attached.",
  },
  {
    rank: 2,
    tag: "$11,000 at risk",
    tone: "amber",
    headline: "A quarter of your receivable is more than 60 days late.",
    body: "$38,400 is owed to you; $11,000 of it is 60+ days out, and $8,240 of that is Johnson Property Group (68 days). We emailed them July 12 and again July 28.",
    action:
      "Do this: call Johnson's AP contact this week — email has stopped working. A one-paragraph call script is on page 4.",
  },
  {
    rank: 3,
    tag: "$427 this month",
    tone: "gold",
    headline: "Ferguson's early-pay discount is on the table again.",
    body: "Pay the $21,340 Ferguson bill by August 8 and keep $427. You've missed this discount in four of the last six months — roughly $1,740 left on the table so far this year.",
    action:
      "Do this: approve the Ferguson payment before Friday. It's already drafted and queued in your bill pay — it needs one click from you.",
  },
  {
    rank: 4,
    tag: "13% of gross profit",
    tone: "green",
    headline: "After-hours work is quietly your best line of business.",
    body: "Emergency calls were $18,940 — 7% of revenue — but ran a 61% gross margin against 34% on new installations. That's 13% of every dollar of gross profit you made in July.",
    action:
      "Do this: it's worth testing a second on-call tech for the winter. We've modelled it — breakeven is 9 additional calls a month.",
  },
  {
    rank: 5,
    tag: "No action needed",
    tone: "green",
    headline: "Cash runway is 4.2 months and holds through the fall.",
    body: "$231,800 on hand against $55,200 of average monthly operating cost. The Ferguson bill and the September vehicle payment land in the same week.",
    action:
      "Watch, don't act: your low point is roughly $196,000 on September 12. Still comfortable — we'll flag it if that changes.",
  },
];

/* -------------------------------------------------- Money in motion ------ */

export const arAging = [
  ["Current (0–30 days)", 19150],
  ["31–60 days", 8250],
  ["61–90 days", 8240],
  ["Over 90 days", 2760],
];
export const arTotal = 38400;

export const arDetail = [
  {
    customer: "Meridian Facilities Mgmt",
    amount: 7900,
    days: 19,
    status: "On terms — due Aug 21",
    tone: "ok",
  },
  {
    customer: "Johnson Property Group",
    amount: 8240,
    days: 68,
    status: "Chased twice — call recommended",
    tone: "bad",
  },
  {
    customer: "Ridgeview Apartments LLC",
    amount: 4600,
    days: 47,
    status: "Reminder sent Aug 3",
    tone: "warn",
  },
  {
    customer: "Northgate Storage Partners",
    amount: 3650,
    days: 38,
    status: "Reminder sent Aug 3",
    tone: "warn",
  },
  {
    customer: "Calloway Dental Associates",
    amount: 2760,
    days: 104,
    status: "Third notice — consider collections",
    tone: "bad",
  },
  {
    customer: "14 other accounts",
    amount: 11250,
    days: 21,
    status: "All current",
    tone: "ok",
  },
];

export const apDetail = [
  {
    vendor: "Ferguson Plumbing Supply",
    amount: 21340,
    due: "Aug 15",
    note: "2/10 net 30 — pay by Aug 8, keep $427",
    tone: "gold",
  },
  {
    vendor: "Winsupply of Bergen County",
    amount: 11920,
    due: "Aug 22",
    note: "Net 30 — drafted, awaiting your approval",
    tone: "ok",
  },
  {
    vendor: "Delgado Excavating (sub)",
    amount: 8600,
    due: "Aug 12",
    note: "Retainage released — lien waiver on file",
    tone: "ok",
  },
  {
    vendor: "Grainger",
    amount: 4180,
    due: "Aug 28",
    note: "Net 30 — drafted",
    tone: "ok",
  },
  {
    vendor: "Natural gas & utilities",
    amount: 2910,
    due: "Aug 10",
    note: "Autopay — no action",
    tone: "ok",
  },
  {
    vendor: "7 other bills",
    amount: 3230,
    due: "Aug 9 – Aug 30",
    note: "All drafted",
    tone: "ok",
  },
];
export const apTotal = 52180;

/* ------------------------------------------------------- Scoreboard ------ */

/**
 * `direction` decides what a full arc means, which matters because one of
 * these three is bad news when it grows. On an "up" metric the arc fills as
 * the number rises; on a "down" metric it empties, so a nearly-full arc always
 * reads as healthy and never as "almost complete".
 *
 * `min`/`max` are the arc's end labels as well as its scale.
 *
 * `healthyFrom` shades the acceptable band on the arc, in arc space (0 = left
 * end, 1 = right end) so it works the same on an inverted gauge. It puts the
 * benchmark the "How to read it" page already states — above three months of
 * runway is healthy for a trades business — onto the dial itself, so the
 * gauge teaches without having to be read.
 */
export const scoreboard = [
  {
    label: "Cash runway",
    value: "4.2",
    unit: "months",
    status: "good",
    direction: "up",
    amount: 4.2,
    min: 0,
    max: 6,
    minLabel: "0 mo",
    maxLabel: "6 mo",
    healthyFrom: 0.5,
    healthyLabel: "Healthy above 3 months",
    note: "$231,800 on hand ÷ $55,200 average monthly operating cost.",
  },
  {
    label: "Customers owe you",
    value: "$38,400",
    unit: "",
    status: "watch",
    direction: "down",
    amount: 38400,
    min: 0,
    max: 60000,
    minLabel: "$0",
    maxLabel: "$60K",
    healthyFrom: 0.6,
    healthyLabel: "Healthy under $24,000 owed",
    note: "$11,000 of it is 60+ days late. Two accounts, both chased.",
  },
  {
    label: "Profit per job",
    value: "$312",
    unit: "",
    status: "good",
    direction: "up",
    amount: 312,
    min: 0,
    max: 400,
    minLabel: "$0",
    maxLabel: "$400",
    healthyFrom: 0.625,
    healthyLabel: "Healthy above $250 a job",
    note: "$91,600 of gross profit across 294 completed jobs.",
  },
];

export const scoreboardSecondary = [
  ["Gross margin", "35.5%", "good", "Up from 34.8% in June"],
  ["Jobs completed", "294", "good", "71 in the final week alone"],
  ["Average ticket", "$879", "good", "Up $34 vs. the trailing 3 months"],
  ["Revenue vs. last month", "+8.0%", "good", "$258,390 vs. $239,250"],
];

/* ------------------------------------------------ Budget vs. actual ------ */

export const variance = [
  ["Revenue", 245000, 258390, 13390, "+5.5%", "good"],
  ["Cost of revenue", 158800, 166790, -7990, "−5.0%", "warn"],
  ["Gross profit", 86200, 91600, 5400, "+6.3%", "good"],
  ["Operating expenses", 66500, 70400, -3900, "−5.9%", "warn"],
  ["Operating income", 19700, 21200, 1500, "+7.6%", "good"],
];

export const varianceNotes = [
  "Revenue beat plan by $13,390 on an unusually hot second week — emergency calls ran 41% above forecast between July 8 and July 14.",
  "Cost of revenue ran $7,990 over, and $5,100 of that is subcontracted overflow. That is the right kind of overage: it bought you $14,600 of work you would otherwise have turned away.",
  "Card fees are $1,140 over budget and that one is genuinely fixable — see Insight 1.",
];

/* -------------------------------------------------------- Forecast ------- */

export const forecast = [
  ["Aug", 262, 238],
  ["Sep", 248, 221],
  ["Oct", 236, 214],
  ["Nov", 219, 209],
  ["Dec", 208, 196],
  ["Jan", 231, 203],
  ["Feb", 226, 211],
  ["Mar", 254, 228],
  ["Apr", 268, 246],
  ["May", 271, 259],
  ["Jun", 263, 268],
  ["Jul", 277, 284],
];

/* --------------------------------------------------- Weekly email -------- */

export const weekly = {
  subject: "Riverside Plumbing — your week in three lines",
  date: "Monday, August 10, 2026 · 6:02 AM",
  lines: [
    ["Cash", "$231,800", "up $14,200 on the week", "good"],
    ["Customers owe you", "$38,400", "$11,000 is 60+ days late", "watch"],
    ["Jobs closed", "71", "average ticket $879", "good"],
  ],
  footer:
    "One thing worth doing this week: approve the Ferguson payment before Friday and keep $427.",
};
