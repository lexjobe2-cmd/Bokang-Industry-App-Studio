export const ledgerPathways = [
  {
    slug:"monthly-finance-desk",
    title:"Monthly Finance Desk",
    kicker:"The front door",
    summary:"Keep the books current, management information useful and month-end under control.",
    outcomes:["Monthly bookkeeping / processing","Management accounts","Bank and balance-sheet reconciliations","Cash-flow visibility","Document request rhythm"]
  },
  {
    slug:"payroll-compliance",
    title:"Payroll & Compliance",
    kicker:"Keep obligations moving",
    summary:"A structured recurring workflow for payroll, statutory information and routine compliance support.",
    outcomes:["Payroll processing","Recurring deadline control","Supporting schedules","Client document collection","Review / sign-off workflow"]
  },
  {
    slug:"finance-advisory",
    title:"Finance & Advisory",
    kicker:"Look forward",
    summary:"Turn accurate financial information into decisions about performance, cash, risk and growth.",
    outcomes:["Forecasting","Performance review","Finance-process improvement","Management reporting","Business planning support"]
  }
];

export const ledgerIndustries = [
  {title:"Owner-managed businesses",text:"A finance function without needing a large internal team from day one."},
  {title:"Professional services",text:"Recurring bookkeeping, payroll, reporting and cash-flow visibility around client work."},
  {title:"Retail & distribution",text:"Higher transaction volumes, stock-linked reporting and tighter monthly controls."},
  {title:"Projects & contractors",text:"Job/project visibility, supplier information and management reporting around delivery."}
];

export const ledgerInsights = [
  {title:"Is your month-end actually closed?",summary:"A practical checklist for knowing whether the numbers are ready to manage from."},
  {title:"What should a monthly management pack tell you?",summary:"Five questions useful financial reporting should answer for an owner or manager."},
  {title:"When bookkeeping becomes a decision problem",summary:"Signs that a business needs more than transaction processing and year-end cleanup."}
];

export function ledgerClientQuery(clientName:string){
  return "?client="+encodeURIComponent(clientName);
}
