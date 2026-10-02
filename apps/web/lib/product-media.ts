import type { ProductSlug } from "@bokang/app-config";

export type ProductMedia = {
  imageUrl: string;
  sourceUrl: string;
  sourceLabel: string;
  alt: string;
  locality?: string;
};

export const productMedia: Partial<Record<ProductSlug, ProductMedia>> = {
  "lex-intake": {
    imageUrl: "https://images.pexels.com/photos/4427622/pexels-photo-4427622.jpeg?auto=compress&dpr=1&h=900&w=1600",
    sourceUrl: "https://www.pexels.com/photo/businesswoman-in-her-office-4427622/",
    sourceLabel: "Pexels · August de Richelieu",
    alt: "Black professional woman in a modern legal-style office",
    locality: "Professional services"
  },
  "ledger-desk": {
    imageUrl: "https://images.pexels.com/photos/8297145/pexels-photo-8297145.jpeg?auto=compress&dpr=1&h=900&w=1600",
    sourceUrl: "https://www.pexels.com/photo/a-woman-using-a-calculator-8297145/",
    sourceLabel: "Pexels · Mikhail Nilov",
    alt: "Black finance professional using a calculator and reviewing documents",
    locality: "Finance operations"
  },
  "tax-flow": {
    imageUrl: "https://images.pexels.com/photos/5668875/pexels-photo-5668875.jpeg?auto=compress&dpr=1&h=900&w=1600",
    sourceUrl: "https://www.pexels.com/photo/confident-female-accountant-carrying-documents-5668875/",
    sourceLabel: "Pexels · Sora Shimazaki",
    alt: "Black accounting professional carrying financial documents",
    locality: "Tax & compliance"
  },
  "clinic-flow": {
    imageUrl: "https://images.pexels.com/photos/6303652/pexels-photo-6303652.jpeg?auto=compress&dpr=1&h=900&w=1600",
    sourceUrl: "https://www.pexels.com/photo/doctor-showing-diagnosis-to-black-patient-in-hospital-6303652/",
    sourceLabel: "Pexels · Klaus Nielsen",
    alt: "Healthcare professional consulting with a Black patient",
    locality: "Patient care"
  },
  "pharma-desk": {
    imageUrl: "https://images.pexels.com/photos/8657365/pexels-photo-8657365.jpeg?auto=compress&dpr=1&h=900&w=1600",
    sourceUrl: "https://www.pexels.com/photo/woman-with-braid-hair-arranging-medicine-bottles-8657365/",
    sourceLabel: "Pexels · cottonbro studio",
    alt: "Pharmacy professional arranging medicine inventory on shelves",
    locality: "Medicine operations"
  },
  "build-quote": {
    imageUrl: "https://images.unsplash.com/photo-1664662566501-73a7e41d8c19?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    sourceUrl: "https://unsplash.com/photos/a-building-under-construction-Ler7ucoR7vc",
    sourceLabel: "Unsplash · Thatselby",
    alt: "Construction activity in Gaborone, Botswana",
    locality: "Gaborone · Botswana"
  },
  "explore-bw": {
    imageUrl: "https://images.unsplash.com/photo-1759252973843-957dc1b5e0e5?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    sourceUrl: "https://unsplash.com/photos/people-poling-boats-through-a-grassy-wetland-xG-gaNxYjFE",
    sourceLabel: "Unsplash · Ed Wingate",
    alt: "People travelling by mokoro in the Okavango Delta, Botswana",
    locality: "Okavango Delta · Botswana"
  },
  "move-track": {
    imageUrl: "https://images.unsplash.com/photo-1759130534261-3895289d6011?auto=format&fit=crop&fm=jpg&q=82&w=1800",
    sourceUrl: "https://unsplash.com/photos/two-open-top-vehicles-drive-on-a-dusty-road-ZMIdqdsbP2U",
    sourceLabel: "Unsplash · Ed Wingate",
    alt: "Vehicles travelling on a dusty road in Chobe National Park, Botswana",
    locality: "Chobe · Botswana"
  }
};
