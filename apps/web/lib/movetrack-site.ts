export type LogisticsService = {
  slug:string;
  title:string;
  summary:string;
  details:string[];
  image:string;
  source:string;
};

export const moveTrackServices:LogisticsService[]=[
  {
    slug:"road-freight",
    title:"Road Freight",
    summary:"Nationwide and regional movement for general cargo, industrial loads and scheduled distribution.",
    details:["Full-load and dedicated transport","Botswana nationwide coverage","Cross-border route planning","Proof-of-delivery workflow"],
    image:"https://images.pexels.com/photos/36298868/pexels-photo-36298868.jpeg?auto=compress&dpr=1&h=1000&w=1600",
    source:"https://www.pexels.com/photo/wide-load-truck-on-open-highway-in-africa-36298868/"
  },
  {
    slug:"mining-industrial",
    title:"Mining & Industrial Logistics",
    summary:"Fleet and transport support for mine sites, heavy industry, shutdowns and production-critical movements.",
    details:["Mine-site transport support","Pre-start and fleet compliance","Industrial/project cargo","Driver/site authorisation workflows"],
    image:"https://images.pexels.com/photos/4612683/pexels-photo-4612683.jpeg?auto=compress&dpr=1&h=1000&w=1600",
    source:"https://www.pexels.com/photo/black-men-and-freight-rusty-transport-4612683/"
  },
  {
    slug:"warehousing-distribution",
    title:"Warehousing & Distribution",
    summary:"Storage, staging and dispatch support for customers that need more than point-to-point transport.",
    details:["Receiving and dispatch","Inventory staging","Distribution support","Transport handoff"],
    image:"https://images.pexels.com/photos/29786116/pexels-photo-29786116.jpeg?auto=compress&dpr=1&h=1000&w=1600",
    source:"https://www.pexels.com/photo/warehouse-with-delivery-truck-exiting-the-loading-dock-29786116/"
  },
  {
    slug:"cross-border",
    title:"Cross-Border & Customs Coordination",
    summary:"Structured movement across SADC routes with shipment details, documentation and border handoff kept visible.",
    details:["SADC lane planning","Customs-document coordination","Import/export support","Shipment visibility"],
    image:"https://images.pexels.com/photos/36298868/pexels-photo-36298868.jpeg?auto=compress&dpr=1&h=1000&w=1600",
    source:"https://www.pexels.com/photo/wide-load-truck-on-open-highway-in-africa-36298868/"
  }
];

export const moveTrackIndustries=[
  {title:"Mining",text:"Production support, mine-site vehicle controls, material movement and industrial logistics."},
  {title:"Construction",text:"Project materials, equipment movement and scheduled site deliveries."},
  {title:"Agriculture",text:"Inputs, bulk goods, feed and regional distribution."},
  {title:"Retail & FMCG",text:"Scheduled distribution and last-mile delivery support."},
  {title:"Manufacturing",text:"Inbound materials, outbound product and production support logistics."},
  {title:"Projects",text:"Oversized, specialist or coordinated movements that need planning before dispatch."}
];

export const moveTrackFleet=[
  {type:"Side tipper combinations",use:"Bulk minerals, aggregate and industrial haulage"},
  {type:"Flat-deck trailers",use:"Machinery, palletised freight and project cargo"},
  {type:"Light vehicles / LDVs",use:"Site support, supervisors and mine-compliant movement"},
  {type:"Service vehicles",use:"Field support, maintenance and urgent operational movements"}
];

export const moveTrackCoverage=[
  {name:"Gaborone",lat:-24.6282,lng:25.9231,detail:"Head-office / distribution hub concept"},
  {name:"Francistown",lat:-21.1700,lng:27.5079,detail:"Northern Botswana corridor"},
  {name:"Palapye",lat:-22.5461,lng:27.1256,detail:"Central transport corridor"},
  {name:"Selebi-Phikwe",lat:-21.9789,lng:27.8426,detail:"Mining / industrial corridor"},
  {name:"Maun",lat:-19.9833,lng:23.4167,detail:"North-west Botswana operations"},
  {name:"Kasane",lat:-17.8016,lng:25.1500,detail:"Northern border / tourism corridor"}
];

export function moveTrackClientQuery(clientName:string){
  return "?client="+encodeURIComponent(clientName);
}
