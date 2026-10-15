export type CultureCategory = "Basketry" | "Traditional clothing" | "Jewellery" | "Pottery" | "Books" | "Art" | "Artefacts" | "Food" | "Experiences";
export type CultureStoreKind = "shop" | "venue" | "mixed";
export type CulturePayment = "Cash" | "Orange Money" | "MyZaka" | "Smega" | "Bank transfer on arrangement";
export type CultureLocation = { label: string; town: string; lat?: number; lng?: number; precision: "town" | "precise" };
export type CultureStore = {
  id: string; name: string; description: string; ownerName: string; kind: CultureStoreKind;
  category: CultureCategory; location: CultureLocation; phone: string; whatsapp: string;
  payments: CulturePayment[]; pickup: boolean; delivery: boolean; openingHours: string;
  image?: string; createdAt: string; demo?: boolean;
};
export type CultureListing = {
  id: string; storeId: string; name: string; description: string; category: CultureCategory;
  price: number; stock: number; status: "published" | "draft"; image?: string;
  createdAt: string; demo?: boolean;
};
export type CultureVenue = {
  id: string; storeId: string; title: string; description: string; capacity: number;
  priceNote: string; features: string[]; image?: string; createdAt: string; demo?: boolean;
};
export type CultureEnquiry = {
  id: string; storeId: string; listingIds: string[]; customer: string; phone: string;
  date: string; guests: number; message: string; type: "venue" | "experience";
  status: "new" | "reviewing" | "responded" | "closed"; createdAt: string;
};
export type CultureCartLine = { listingId: string; quantity: number };

export const cultureKeys = {
  stores: "bokang-studio.culture.stores.v1",
  listings: "bokang-studio.culture.listings.v1",
  venues: "bokang-studio.culture.venues.v1",
  enquiries: "bokang-studio.culture.enquiries.v1",
  cart: "bokang-studio.culture.cart.v1",
  saved: "bokang-studio.culture.saved.v1",
};
export const cultureCategories: CultureCategory[] = ["Basketry","Traditional clothing","Jewellery","Pottery","Books","Art","Artefacts","Food","Experiences"];
export const culturePayments: CulturePayment[] = ["Cash","Orange Money","MyZaka","Smega","Bank transfer on arrangement"];
// Approximate town centres for privacy-friendly location previews, not exact storefront coordinates.
export const botswanaTowns = [
  {name:"Gaborone",lat:-24.6282,lng:25.9231},
  {name:"Maun",lat:-19.9833,lng:23.4167},
  {name:"Kasane",lat:-17.7983,lng:25.1536},
  {name:"Francistown",lat:-21.1700,lng:27.5079},
  {name:"Serowe",lat:-22.3875,lng:26.7108},
  {name:"Palapye",lat:-22.5461,lng:27.1257},
  {name:"Mochudi",lat:-24.3770,lng:26.1525},
  {name:"Thamaga",lat:-24.6705,lng:25.5398},
  {name:"Gabane",lat:-24.6667,lng:25.7833},
  {name:"Oodi",lat:-24.5700,lng:26.0400},
  {name:"Kanye",lat:-24.9667,lng:25.3333},
  {name:"Molepolole",lat:-24.4066,lng:25.4951},
  {name:"Ghanzi",lat:-21.6980,lng:21.6480},
  {name:"Shakawe",lat:-18.3640,lng:21.8400},
  {name:"Tsabong",lat:-26.0218,lng:22.4014},
  {name:"Letlhakane",lat:-21.4149,lng:25.5925},
] as const;
export function townLocation(town: string): CultureLocation {
  const known = botswanaTowns.find(t=>t.name.toLowerCase()===town.trim().toLowerCase());
  return { town: known?.name || town.trim(), label: known?.name || town.trim(), precision:"town", lat:known?.lat, lng:known?.lng };
}
export function isBotswanaMobile(phone: string): boolean {
  const digits=phone.replace(/\D/g,""); const local=digits.startsWith("267")?digits.slice(3):digits;
  return /^7\d{7}$/.test(local);
}
export function normalizeBotswanaNumber(phone: string): string | null {
  const digits=phone.replace(/\D/g,"");const local=digits.startsWith("267")?digits.slice(3):digits;
  return /^7\d{7}$/.test(local)?"267"+local:null;
}
export function whatsappHref(phone: string, message: string): string {
  const n=normalizeBotswanaNumber(phone);
  return n ? "https://wa.me/"+n+"?text="+encodeURIComponent(message) : "";
}
export function cultureMoney(amount: number) { return "P "+Number(amount || 0).toLocaleString("en-BW",{maximumFractionDigits:2,minimumFractionDigits:2}); }
export function cultureMessage(store: CultureStore, lines: Array<{name:string;quantity:number;price:number}>) {
  const total=lines.reduce((n,x)=>n+x.price*x.quantity,0);
  return ["Dumela "+store.name+",","I would like to enquire about these items:",
    ...lines.map(x=>"- "+x.name+" x"+x.quantity+" @ "+cultureMoney(x.price)+" = "+cultureMoney(x.price*x.quantity)),
    "Total estimate: "+cultureMoney(total),
    "Please confirm stock, collection/delivery and how to pay.",
    "Preferred payment methods: "+store.payments.join(", "),
    "Sent from Botswana Cultural Explorer (no payment was made)."].join("\n");
}
export function safeCultureImage(url?:string) {
  if(!url) return "";
  if(/^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(url))return url;
  try {const parsed=new URL(url);return parsed.protocol==="https:"?parsed.toString():"";}catch{return "";}
}
export function osmEmbed(location: CultureLocation): string {
  if(typeof location.lat!=="number"||typeof location.lng!=="number")return "";
  const lat=Math.max(-30,Math.min(-16,location.lat)),lng=Math.max(18,Math.min(30,location.lng));
  const radius=location.precision==="precise"?.014:.105;
  const bbox=[lng-radius,lat-radius,lng+radius,lat+radius].join("%2C");
  return "https://www.openstreetmap.org/export/embed.html?bbox="+bbox+"&layer=mapnik&marker="+lat+"%2C"+lng;
}
export function osmSearchUrl(query: string) { return "https://www.openstreetmap.org/search?query="+encodeURIComponent(query+", Botswana"); }
export function cultureId(prefix:string) {return prefix+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7);}
export const culturalEditorial = [
  {name:"Tsodilo Hills",area:"North-west Botswana",kind:"Heritage",description:"An ancestral rock-art landscape and UNESCO World Heritage Site. Plan with local guides.",url:"https://www.botswanatourism.co.bw/explore/tsodilo-hills",symbol:"⛰"},
  {name:"Basket weaving",area:"Ngamiland and across Botswana",kind:"Craft tradition",description:"Discover the craft of mokolwane-palm baskets and the makers who sustain it.",url:"https://www.botswanatourism.co.bw/arts-and-crafts",symbol:"🧺"},
  {name:"Pottery and ceramics",area:"Thamaga & Gabane",kind:"Craft tradition",description:"Explore places associated with local pottery and ceramic traditions.",url:"https://www.botswanatourism.co.bw/arts-and-crafts",symbol:"🏺"},
  {name:"Cultural tourism",area:"Across Botswana",kind:"Experiences",description:"Learn about villages, community-led cultural visits and Botswana heritage.",url:"https://www.botswanatourism.co.bw/",symbol:"🌾"},
  {name:"Old Palapye",area:"Tswapong Hills region",kind:"Heritage",description:"Trace the history of Phalatswe, a former Bangwato capital and protected cultural monument.",url:"https://www.botswanatourism.co.bw/explore/old-palapye",symbol:"🏛"},
  {name:"Okavango Delta",area:"North-west Botswana",kind:"Nature & culture",description:"Discover the extraordinary wetlands, local guiding and traditional mokoro experiences.",url:"https://botswanatourism.co.bw/explore/okavango-delta",symbol:"🛶"},
  {name:"Chobe National Park",area:"Kasane and Chobe",kind:"Wildlife & places",description:"Explore Chobe River landscapes, wildlife viewing and the region's culture markets.",url:"https://www.botswanatourism.co.bw/index.php/explore/chobe-national-park",symbol:"🐘"},
  {name:"Moremi Game Reserve",area:"Ngamiland",kind:"Community heritage",description:"Learn about a reserve first established by local communities to protect ancestral lands and wildlife.",url:"https://botswanatourism.co.bw/explore/moremi-game-reserve",symbol:"🦓"},
];
// Fictional local-only example records, not verified businesses or available-to-buy offers.
export const cultureDemoStores: CultureStore[] = [
  {id:"demo-crafts",name:"Ngwao Craft House · Demo",description:"A demonstration storefront celebrating traditional basketry, pottery and handmade keepsakes.",ownerName:"Demo seller",kind:"shop",category:"Basketry",location:townLocation("Maun"),phone:"",whatsapp:"",payments:["Cash","Orange Money"],pickup:true,delivery:false,openingHours:"Confirm with seller",createdAt:"2026-10-15",demo:true},
  {id:"demo-threads",name:"Pula Heritage Threads · Demo",description:"A sample showcase for thoughtful traditional clothing, jewellery and contemporary Botswana makers.",ownerName:"Demo seller",kind:"shop",category:"Traditional clothing",location:townLocation("Gaborone"),phone:"",whatsapp:"",payments:["Cash","MyZaka"],pickup:true,delivery:false,openingHours:"Confirm with seller",createdAt:"2026-10-15",demo:true},
  {id:"demo-venue",name:"Kgotla Culture Courtyard · Demo",description:"A fictional venue showing how a heritage experience host can accept date and group enquiries.",ownerName:"Demo host",kind:"venue",category:"Experiences",location:townLocation("Thamaga"),phone:"",whatsapp:"",payments:["Cash"],pickup:false,delivery:false,openingHours:"By prior arrangement",createdAt:"2026-10-15",demo:true},
];
export const cultureDemoListings: CultureListing[] = [
  {id:"basket-demo",storeId:"demo-crafts",name:"Handwoven basket · sample",description:"Illustrative woven-basket listing inspired by Botswana basketry. Not a real offer.",category:"Basketry",price:380,stock:3,status:"published",createdAt:"2026-10-15",demo:true},
  {id:"pottery-demo",storeId:"demo-crafts",name:"Decorative clay vessel · sample",description:"Illustrative ceramic piece. Verify the artist, dimensions and price in a real listing.",category:"Pottery",price:240,stock:2,status:"published",createdAt:"2026-10-15",demo:true},
  {id:"attire-demo",storeId:"demo-threads",name:"Heritage-inspired shawl · sample",description:"Illustrative cultural fashion listing; colours and sizes to be agreed with a real maker.",category:"Traditional clothing",price:420,stock:5,status:"published",createdAt:"2026-10-15",demo:true},
  {id:"beads-demo",storeId:"demo-threads",name:"Handcrafted beadwork · sample",description:"Illustrative artisan jewellery, not a current seller listing.",category:"Jewellery",price:185,stock:4,status:"published",createdAt:"2026-10-15",demo:true},
  {id:"book-demo",storeId:"demo-crafts",name:"Botswana cultural reading · sample",description:"Placeholder for locally sourced books and folklore collections; not an actual title.",category:"Books",price:150,stock:1,status:"published",createdAt:"2026-10-15",demo:true},
];
export const cultureDemoVenues: CultureVenue[]=[{
  id:"venue-demo",storeId:"demo-venue",title:"Community culture gathering · sample",
  description:"Demonstration of an advance enquiry for guided storytelling, craft activity or cultural gathering. No event or reservation exists.",capacity:35,
  priceNote:"Price and availability on enquiry",features:["Group enquiries","Cultural storytelling","Advance planning"],createdAt:"2026-10-15",demo:true,
}];
/** Future-only adapter contract. Never initialize Firebase or Drive in demo mode. */
export type CultureIdentityPort = { signInWithGoogle(): Promise<{uid:string;displayName:string}>; signOut():Promise<void>; currentUser():Promise<{uid:string}|null> };
export type CultureStoragePort = { loadUserSnapshot(uid:string):Promise<{stores:CultureStore[];listings:CultureListing[];venues:CultureVenue[]}>; saveUserSnapshot(uid:string,data:{stores:CultureStore[];listings:CultureListing[];venues:CultureVenue[]}):Promise<void> };
export const cultureIntegrationStatus={firebaseAuth:"not-configured",googleDrive:"not-configured",onlinePayments:"not-supported"} as const;
