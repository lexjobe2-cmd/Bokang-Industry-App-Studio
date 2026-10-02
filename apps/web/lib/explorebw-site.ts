export type SafariPackage = {
  slug:string;
  title:string;
  kicker:string;
  duration:string;
  start:string;
  end:string;
  route:string[];
  travelStyle:string;
  priceGuide:string;
  summary:string;
  image:string;
  source:string;
  highlights:string[];
  itinerary:Array<{day:string;title:string;detail:string}>;
  inclusions:string[];
};

export const exploreDestinations = [
  {name:"Okavango Delta",base:"Maun",lat:-19.2833,lng:22.9,detail:"Mokoro channels · floodplains · wildlife"},
  {name:"Moremi / Khwai",base:"Maun",lat:-19.2,lng:23.75,detail:"Game drives · predator country · community concessions"},
  {name:"Chobe",base:"Kasane",lat:-18.6667,lng:24.5,detail:"Elephants · riverfront · boat safaris"},
  {name:"Makgadikgadi",base:"Maun / Nata",lat:-20.7167,lng:25.3,detail:"Salt pans · desert landscapes · seasonal wildlife"},
];

export const explorePackages:SafariPackage[]=[
  {
    slug:"delta-mokoro-escape",
    title:"Okavango Delta Mokoro Escape",
    kicker:"Slow travel · water · wildlife",
    duration:"3 days / 2 nights",
    start:"Maun",
    end:"Maun",
    route:["Maun","Okavango Delta","Maun"],
    travelStyle:"Private / small group",
    priceGuide:"From P 8,900 pp · concept guide",
    summary:"A gentle introduction to the Delta built around mokoro travel, guided nature walks and time away from the road.",
    image:"https://images.unsplash.com/photo-1759252973843-957dc1b5e0e5?auto=format&fit=crop&fm=jpg&q=84&w=1600",
    source:"https://unsplash.com/photos/people-poling-boats-through-a-grassy-wetland-xG-gaNxYjFE",
    highlights:["Mokoro excursion","Guided bush walk","Delta sunset","Small-group pace"],
    itinerary:[
      {day:"Day 1",title:"Maun → Delta",detail:"Meet in Maun, travel into the Delta and settle into camp before an afternoon water-based activity."},
      {day:"Day 2",title:"Waterways & walking",detail:"Morning mokoro exploration, guided nature walk and unhurried wildlife viewing between activities."},
      {day:"Day 3",title:"Delta → Maun",detail:"Final morning activity followed by transfer back toward Maun and onward travel."},
    ],
    inclusions:["Local transfers in the outlined itinerary","Guided safari activities","Accommodation/camp concept","Meals while on safari","Trip briefing"],
  },
  {
    slug:"chobe-river-safari",
    title:"Chobe River Safari",
    kicker:"Elephants · river · sunset",
    duration:"2 days / 1 night",
    start:"Kasane",
    end:"Kasane",
    route:["Kasane","Chobe Riverfront","Kasane"],
    travelStyle:"Private or shared",
    priceGuide:"From P 5,600 pp · concept guide",
    summary:"A short Chobe experience pairing a river safari with classic game viewing for travelers with limited time.",
    image:"https://images.unsplash.com/photo-1759130534261-3895289d6011?auto=format&fit=crop&fm=jpg&q=84&w=1600",
    source:"https://unsplash.com/photos/two-open-top-vehicles-drive-on-a-dusty-road-ZMIdqdsbP2U",
    highlights:["Chobe River cruise","Game drive","Elephant country","Kasane start/end"],
    itinerary:[
      {day:"Day 1",title:"Kasane & Chobe River",detail:"Arrival briefing followed by river-based wildlife viewing and sunset on the Chobe River."},
      {day:"Day 2",title:"Early game drive",detail:"Morning game drive through Chobe before returning to Kasane for onward travel."},
    ],
    inclusions:["Safari activities listed","Local transfers","One-night accommodation concept","Selected meals","Guide services"],
  },
  {
    slug:"northern-botswana-trail",
    title:"Northern Botswana Trail",
    kicker:"Khwai · Savuti · Chobe",
    duration:"7 days / 6 nights",
    start:"Maun",
    end:"Kasane",
    route:["Maun","Khwai","Savuti","Chobe","Kasane"],
    travelStyle:"Private safari",
    priceGuide:"From P 31,500 pp · concept guide",
    summary:"A longer overland safari linking some of northern Botswana's most rewarding wildlife areas from Maun toward Kasane.",
    image:"https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&fm=jpg&q=84&w=1600",
    source:"https://unsplash.com/s/photos/botswana-safari",
    highlights:["Khwai game viewing","Savuti landscapes","Chobe Riverfront","Maun-to-Kasane routing"],
    itinerary:[
      {day:"Days 1–2",title:"Maun → Khwai",detail:"Travel north into Khwai for game drives and, where conditions allow, water-based activities."},
      {day:"Days 3–4",title:"Savuti",detail:"Continue through changing landscapes for predator-focused game viewing and time in the Savuti area."},
      {day:"Days 5–6",title:"Chobe",detail:"Reach the Chobe region for riverfront wildlife viewing and a contrasting water perspective."},
      {day:"Day 7",title:"Kasane",detail:"Final activity and transfer to Kasane for onward travel."},
    ],
    inclusions:["Overland safari transport","Guide services","Safari accommodation concept","Meals while on safari","Scheduled activities"],
  }
];

export function exploreClientQuery(clientName:string){
  return "?client="+encodeURIComponent(clientName);
}
