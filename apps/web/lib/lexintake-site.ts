export const lexPracticeGroups = [
  {
    slug:"business-transactions",
    title:"Business & Transactions",
    intro:"Corporate, commercial and regulatory advice for companies, founders, investors and institutions.",
    matters:["Corporate & commercial","Banking & finance","Mergers & acquisitions","Competition","Regulatory & compliance","Projects & procurement"]
  },
  {
    slug:"disputes",
    title:"Disputes & Risk",
    intro:"Clear strategy when a commercial relationship, employment matter or other dispute needs formal legal attention.",
    matters:["Civil & commercial litigation","Employment & labour","Debt recovery","Investigations","Urgent applications","Settlement strategy"]
  },
  {
    slug:"property-people",
    title:"Property, People & Private Matters",
    intro:"Practical legal support for property, estates, family and other matters that are personal as well as legal.",
    matters:["Property & conveyancing","Estates & succession","Family law","Immigration","Private agreements","Notarial / document support"]
  }
];

export const lexPeople = [
  {
    name:"Kabelo Dube",
    role:"Concept Managing Partner",
    focus:"Corporate & Commercial · Dispute Resolution",
    bio:"A sample profile showing how the firm can explain experience, sectors and working style without overwhelming visitors with a CV.",
    image:"https://images.pexels.com/photos/8731032/pexels-photo-8731032.jpeg?auto=compress&dpr=1&h=900&w=900",
    source:"https://www.pexels.com/photo/a-woman-in-black-blazer-holding-a-law-book-8731032/"
  },
  {
    name:"Naledi Moagi",
    role:"Concept Partner",
    focus:"Employment · Regulatory · Investigations",
    bio:"A second sample profile demonstrating the authority-building role of lawyer bios on a modern firm website.",
    image:"https://images.pexels.com/photos/4427629/pexels-photo-4427629.jpeg?auto=compress&dpr=1&h=900&w=900",
    source:"https://www.pexels.com/photo/businesswoman-in-her-office-4427629/"
  }
];

export const lexInsights = [
  {
    category:"Doing business",
    title:"Five questions to ask before signing a commercial agreement",
    summary:"A plain-language example of useful client education rather than generic legal commentary."
  },
  {
    category:"Employment",
    title:"Preparing for a disciplinary process: what employers should document",
    summary:"An example of practical content that helps prospective clients understand the process before calling."
  },
  {
    category:"Property",
    title:"What information should be ready before a property transfer begins?",
    summary:"A simple checklist-style article concept that reduces uncertainty around legal work."
  }
];

export function lexClientQuery(clientName:string){
  return "?client="+encodeURIComponent(clientName);
}
