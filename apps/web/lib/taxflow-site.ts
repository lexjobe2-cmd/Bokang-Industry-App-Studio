export const taxClientPaths = [
  {
    slug:"business-tax",
    title:"Business Tax",
    kicker:"Companies & owner-managed businesses",
    summary:"Keep registrations, returns, supporting schedules and tax decisions visible throughout the year.",
    topics:["Company income tax","VAT","Withholding tax","Tax clearance","Objections / correspondence","Tax planning conversations"]
  },
  {
    slug:"employment-payroll",
    title:"Employer & Payroll Tax",
    kicker:"Employers",
    summary:"Create a repeatable rhythm around PAYE-related information, payroll support and recurring tax obligations.",
    topics:["PAYE support","Payroll schedules","Withholding records","Deadline visibility","Employee tax information","Review / submission evidence"]
  },
  {
    slug:"individual-tax",
    title:"Individual Tax",
    kicker:"Individuals & directors",
    summary:"A clearer route from registration and document gathering through preparation, review and submission.",
    topics:["Income tax returns","Multiple income sources","Property / investment information","Supporting records","BURS correspondence","Tax planning questions"]
  },
  {
    slug:"tax-advisory",
    title:"Tax Advisory",
    kicker:"Year-round decisions",
    summary:"Bring tax into the conversation before a transaction, restructuring or deadline creates avoidable pressure.",
    topics:["Transaction planning","Business restructuring","Tax-risk review","Interpretation / research","Scenario planning","BURS engagement support"]
  }
];

export const taxGuidanceCards = [
  {
    title:"BURS e-Services",
    text:"Official workspace for filing, payments, taxpayer-profile updates and other BURS e-services.",
    href:"https://eservices.burs.org.bw/"
  },
  {
    title:"2026 tax downloads",
    text:"Current BURS tax tables, VAT notices, legislation and downloadable guidance.",
    href:"https://burs.org.bw/index.php/tax/tax-downloads"
  },
  {
    title:"BURS tax information",
    text:"Official Botswana tax information, notices and contact channels.",
    href:"https://burs.org.bw/"
  }
];

export const taxInsights = [
  {title:"What should be ready before a tax return starts?",summary:"A practical records-first checklist that reduces document chasing later."},
  {title:"Why tax clearance problems often begin earlier",summary:"A concept article about keeping registrations, returns, payments and correspondence visible throughout the year."},
  {title:"When to ask for tax advice before a transaction",summary:"Examples of decisions where early tax input may be more useful than post-event cleanup."}
];

export function taxClientQuery(clientName:string){
  return "?client="+encodeURIComponent(clientName);
}
