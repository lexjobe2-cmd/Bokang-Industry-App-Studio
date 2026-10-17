export type BuildQuoteProject = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  scope: string;
  summary: string;
  challenge: string;
  response: string;
  outcome: string;
  image: string;
  source: string;
};

export const buildQuoteProjects: BuildQuoteProject[] = [
  {
    slug:"commercial-office-development",
    title:"Commercial Office Development",
    category:"Commercial",
    location:"Gaborone",
    year:"2026 concept",
    scope:"Structural works · interior fit-out · project coordination",
    summary:"A compact commercial development concept focused on practical sequencing, clean finishes and coordinated handover.",
    challenge:"Deliver a professional working environment while coordinating structure, services and finishes around a tight programme.",
    response:"Sequence major trades clearly, maintain visible site controls and communicate milestones to the client throughout delivery.",
    outcome:"A simple case-study format that shows prospective clients how the contractor thinks about delivery—not just what services it sells.",
    image:"https://images.unsplash.com/photo-1591005383705-c7af6a4eedd0?auto=format&fit=crop&fm=jpg&q=82&w=1600",
    source:"https://unsplash.com/photos/aerial-view-of-city-buildings-during-daytime-hO9Z6Ey9jhI"
  },
  {
    slug:"urban-building-works",
    title:"Urban Building Works",
    category:"Building",
    location:"Gaborone",
    year:"2026 concept",
    scope:"General building · site works · finishing",
    summary:"A Botswana urban construction concept demonstrating how project photography and concise scope information can build trust.",
    challenge:"Turn a broad general-building capability into something tangible enough for prospective clients to evaluate.",
    response:"Present the work visually, state the location and scope plainly, and keep technical detail available without overwhelming the page.",
    outcome:"A credible project story that supports conversations with commercial and institutional buyers.",
    image:"https://images.unsplash.com/photo-1664662566501-73a7e41d8c19?auto=format&fit=crop&fm=jpg&q=82&w=1600",
    source:"https://unsplash.com/photos/a-building-under-construction-Ler7ucoR7vc"
  },
  {
    slug:"refurbishment-fitout",
    title:"Refurbishment & Fit-out",
    category:"Refurbishment",
    location:"Greater Gaborone",
    year:"2026 concept",
    scope:"Renovation · electrical · finishes · handover",
    summary:"A refurbishment concept showing how an occupied-space project can be explained through scope, sequencing and handover quality.",
    challenge:"Complete upgrades with minimum disruption while maintaining workmanship and clear client communication.",
    response:"Break the work into controlled phases, capture approvals and keep handover expectations visible.",
    outcome:"A concise case study suitable for a contractor that wants to show both practical execution and professionalism.",
    image:"https://images.pexels.com/photos/11321790/pexels-photo-11321790.jpeg?auto=compress&dpr=1&h=1000&w=1600",
    source:"https://www.pexels.com/photo/construction-man-wearing-a-safety-helmet-11321790/"
  }
];

export const buildQuoteServices = [
  {title:"General building",text:"Commercial, institutional and residential building works."},
  {title:"Civil & site works",text:"Site preparation, concrete, access and supporting infrastructure."},
  {title:"Refurbishment",text:"Renovation, upgrades, repairs and occupied-space improvements."},
  {title:"Project coordination",text:"Planning, site coordination, subcontractor management and handover."}
];

export function buildQuoteClientQuery(clientName:string) {
  return "?client=" + encodeURIComponent(clientName);
}
