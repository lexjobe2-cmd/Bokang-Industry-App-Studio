import type { ProductSlug } from "@bokang/app-config";

export type ProductMedia = {
  imageUrl: string;
  sourceUrl: string;
  sourceLabel: string;
  alt: string;
};

export const productMedia: Partial<Record<ProductSlug, ProductMedia>> = {
  "lex-intake": {
    imageUrl: "https://images.pexels.com/photos/4427622/pexels-photo-4427622.jpeg?auto=compress&dpr=1&h=750&w=1260",
    sourceUrl: "https://www.pexels.com/photo/businesswoman-in-her-office-4427622/",
    sourceLabel: "Pexels · August de Richelieu",
    alt: "Black professional woman in a modern office"
  },
  "ledger-desk": {
    imageUrl: "https://images.pexels.com/photos/4427622/pexels-photo-4427622.jpeg?auto=compress&dpr=1&h=750&w=1260",
    sourceUrl: "https://www.pexels.com/photo/businesswoman-in-her-office-4427622/",
    sourceLabel: "Pexels · August de Richelieu",
    alt: "Black professional woman in an office"
  },
  "tax-flow": {
    imageUrl: "https://images.pexels.com/photos/4427622/pexels-photo-4427622.jpeg?auto=compress&dpr=1&h=750&w=1260",
    sourceUrl: "https://www.pexels.com/photo/businesswoman-in-her-office-4427622/",
    sourceLabel: "Pexels · August de Richelieu",
    alt: "Black professional woman working in an office"
  },
  "clinic-flow": {
    imageUrl: "https://images.pexels.com/photos/6303652/pexels-photo-6303652.jpeg?auto=compress&dpr=1&h=750&w=1260",
    sourceUrl: "https://www.pexels.com/photo/doctor-showing-diagnosis-to-black-patient-in-hospital-6303652/",
    sourceLabel: "Pexels · Klaus Nielsen",
    alt: "Healthcare professional consulting with a Black patient"
  },
  "pharma-desk": {
    imageUrl: "https://images.pexels.com/photos/6303652/pexels-photo-6303652.jpeg?auto=compress&dpr=1&h=750&w=1260",
    sourceUrl: "https://www.pexels.com/photo/doctor-showing-diagnosis-to-black-patient-in-hospital-6303652/",
    sourceLabel: "Pexels · Klaus Nielsen",
    alt: "Healthcare consultation scene"
  },
  "build-quote": {
    imageUrl: "https://images.unsplash.com/photo-1664662568348-24b1482b6354?auto=format&fit=crop&fm=jpg&q=80&w=1600",
    sourceUrl: "https://unsplash.com/photos/a-person-on-a-ladder--7QPeGK2_iU",
    sourceLabel: "Unsplash · Thatselby · Gaborone, Botswana",
    alt: "Construction worker on scaffolding in Gaborone, Botswana"
  },
  "explore-bw": {
    imageUrl: "https://images.unsplash.com/photo-1759252973843-957dc1b5e0e5?auto=format&fit=crop&fm=jpg&q=80&w=1600",
    sourceUrl: "https://unsplash.com/photos/people-poling-boats-through-a-grassy-wetland-xG-gaNxYjFE",
    sourceLabel: "Unsplash · Ed Wingate · Okavango Delta, Botswana",
    alt: "People travelling by mokoro in the Okavango Delta, Botswana"
  },
  "move-track": {
    imageUrl: "https://images.unsplash.com/photo-1759130534261-3895289d6011?auto=format&fit=crop&fm=jpg&q=80&w=1600",
    sourceUrl: "https://unsplash.com/photos/two-open-top-vehicles-drive-on-a-dusty-road-ZMIdqdsbP2U",
    sourceLabel: "Unsplash · Ed Wingate · Chobe National Park, Botswana",
    alt: "Vehicles travelling on a dusty road in Chobe National Park, Botswana"
  }
};
