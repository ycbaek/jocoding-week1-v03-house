// --- Property images ---
const propertyImages = {
  house: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  ],
  condo: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
  ],
  townhome: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&h=400&fit=crop",
  ],
};

function getImageUrl(listing) {
  const pool = propertyImages[listing.type] || propertyImages.house;
  const idx = parseInt(listing.id.replace(/\D/g, ""), 10) % pool.length;
  return pool[idx];
}

// --- Teachable Machine model ---
const TM_MODEL_URL = "https://teachablemachine.withgoogle.com/models/FBWLjBev7/";
let tmModel = null;

async function loadTMModel() {
  try {
    const modelURL = TM_MODEL_URL + "model.json";
    const metadataURL = TM_MODEL_URL + "metadata.json";
    tmModel = await tmImage.load(modelURL, metadataURL);
  } catch (e) {
    console.warn("Teachable Machine model failed to load:", e);
  }
}

async function classifyImage(imgElement) {
  if (!tmModel) return null;
  const predictions = await tmModel.predict(imgElement);
  predictions.sort((a, b) => b.probability - a.probability);
  return predictions;
}

// --- Demo data ---
const listings = [
  {
    id: "L-1001",
    status: "for_sale",
    type: "house",
    price: 1425000,
    beds: 4, baths: 3, sqft: 2780,
    year: 2016,
    address: "14600 NE 87th St, Redmond, WA 98052",
    city: "Redmond",
    daysOn: 6,
    openHouse: true,
    description: "Bright modern home near parks and schools. Open layout, updated kitchen, and a spacious backyard for entertaining.",
  },
  {
    id: "L-1002",
    status: "for_sale",
    type: "townhome",
    price: 945000,
    beds: 3, baths: 2, sqft: 1680,
    year: 2019,
    address: "7312 164th Ave NE, Redmond, WA 98052",
    city: "Redmond",
    daysOn: 12,
    openHouse: false,
    description: "Low-maintenance townhome with attached garage. Great commute access and walkable amenities.",
  },
  {
    id: "L-1003",
    status: "for_rent",
    type: "condo",
    price: 3200,
    beds: 2, baths: 2, sqft: 980,
    year: 2012,
    address: "2210 Westlake Ave N, Seattle, WA 98109",
    city: "Seattle",
    daysOn: 3,
    openHouse: false,
    description: "Waterfront-adjacent condo with skyline views. Building includes gym, lounge, and secure parking.",
  },
  {
    id: "L-1004",
    status: "sold",
    type: "house",
    price: 1280000,
    beds: 4, baths: 2, sqft: 2400,
    year: 2008,
    address: "10512 NE 38th Pl, Kirkland, WA 98033",
    city: "Kirkland",
    daysOn: 0,
    openHouse: false,
    description: "Recently sold. Classic NW style with updated finishes and a quiet neighborhood feel.",
  },
  {
    id: "L-1005",
    status: "for_sale",
    type: "condo",
    price: 610000,
    beds: 1, baths: 1, sqft: 740,
    year: 2020,
    address: "815 Pine St, Seattle, WA 98101",
    city: "Seattle",
    daysOn: 8,
    openHouse: true,
    description: "Downtown condo living with concierge and rooftop deck. Steps away from dining and transit.",
  },
  {
    id: "L-1006",
    status: "for_rent",
    type: "house",
    price: 4600,
    beds: 3, baths: 2, sqft: 1900,
    year: 1998,
    address: "6220 34th Ave NE, Seattle, WA 98115",
    city: "Seattle",
    daysOn: 10,
    openHouse: true,
    description: "Charming rental home in a residential area. Fenced yard, updated appliances, and lots of natural light.",
  },
  {
    id: "L-1007",
    status: "for_sale",
    type: "house",
    price: 1760000,
    beds: 5, baths: 4, sqft: 3320,
    year: 2022,
    address: "4021 154th Pl NE, Bellevue, WA 98007",
    city: "Bellevue",
    daysOn: 2,
    openHouse: false,
    description: "Newer construction with premium finishes. Flexible spaces for office, guests, and entertaining.",
  },
  {
    id: "L-1008",
    status: "sold",
    type: "condo",
    price: 540000,
    beds: 1, baths: 1, sqft: 690,
    year: 2014,
    address: "1500 4th Ave, Seattle, WA 98101",
    city: "Seattle",
    daysOn: 0,
    openHouse: false,
    description: "Recently sold. Great starter condo with easy access to transit and city amenities.",
  },
  {
    id: "L-1009",
    status: "for_sale",
    type: "condo",
    price: 879000,
    beds: 2, baths: 2, sqft: 1120,
    year: 2018,
    address: "77 Beacon St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 5,
    openHouse: true,
    description: "Sun-filled condo near Union Square with modern finishes, private balcony, and easy Green Line access.",
  },
  {
    id: "L-1010",
    status: "for_sale",
    type: "house",
    price: 1349000,
    beds: 4, baths: 3, sqft: 2210,
    year: 2007,
    address: "24 Morrison Ave, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 9,
    openHouse: false,
    description: "Updated single-family home in Davis Square area with finished basement, fenced yard, and off-street parking.",
  },
  {
    id: "L-1011",
    status: "for_rent",
    type: "townhome",
    price: 4200,
    beds: 3, baths: 2, sqft: 1540,
    year: 2015,
    address: "12 Marshall St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 4,
    openHouse: true,
    description: "Contemporary rental townhome close to Assembly Row with in-unit laundry, garage parking, and patio space.",
  },
  // Somerville expansion (100 properties)
  {
    id: "L-2001",
    status: "for_rent",
    type: "house",
    price: 2400,
    beds: 1, baths: 1, sqft: 650,
    year: 1998,
    address: "10 Broadway, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 1,
    openHouse: true,
    description: "Rental house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2002",
    status: "for_sale",
    type: "condo",
    price: 577500,
    beds: 2, baths: 2, sqft: 668,
    year: 1999,
    address: "13 Highland Ave, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 2,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2003",
    status: "for_sale",
    type: "townhome",
    price: 720000,
    beds: 3, baths: 3, sqft: 686,
    year: 2000,
    address: "16 Beacon St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 3,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2004",
    status: "for_sale",
    type: "house",
    price: 812500,
    beds: 4, baths: 1, sqft: 704,
    year: 2001,
    address: "19 Elm St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 4,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2005",
    status: "for_rent",
    type: "condo",
    price: 3100,
    beds: 5, baths: 2, sqft: 722,
    year: 2002,
    address: "22 Summer St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 5,
    openHouse: false,
    description: "Rental condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2006",
    status: "for_sale",
    type: "townhome",
    price: 757500,
    beds: 1, baths: 3, sqft: 740,
    year: 2003,
    address: "25 Washington St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 6,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2007",
    status: "for_sale",
    type: "house",
    price: 850000,
    beds: 2, baths: 1, sqft: 758,
    year: 2004,
    address: "28 Morrison Ave, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 7,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2008",
    status: "for_sale",
    type: "condo",
    price: 652500,
    beds: 3, baths: 2, sqft: 776,
    year: 2005,
    address: "31 Bow St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 8,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2009",
    status: "for_rent",
    type: "townhome",
    price: 3800,
    beds: 4, baths: 3, sqft: 794,
    year: 2006,
    address: "34 Medford St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 9,
    openHouse: false,
    description: "Rental townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2010",
    status: "for_sale",
    type: "house",
    price: 887500,
    beds: 5, baths: 1, sqft: 812,
    year: 2007,
    address: "37 Lowell St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 10,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2011",
    status: "for_sale",
    type: "condo",
    price: 690000,
    beds: 1, baths: 2, sqft: 830,
    year: 2008,
    address: "40 Walnut St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 11,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2012",
    status: "for_sale",
    type: "townhome",
    price: 832500,
    beds: 2, baths: 3, sqft: 848,
    year: 2009,
    address: "43 Central St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 12,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2013",
    status: "for_rent",
    type: "house",
    price: 2400,
    beds: 3, baths: 1, sqft: 866,
    year: 2010,
    address: "46 Park St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 13,
    openHouse: true,
    description: "Rental house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2014",
    status: "for_sale",
    type: "condo",
    price: 727500,
    beds: 4, baths: 2, sqft: 884,
    year: 2011,
    address: "49 Pearl St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 14,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2015",
    status: "for_sale",
    type: "townhome",
    price: 870000,
    beds: 5, baths: 3, sqft: 902,
    year: 2012,
    address: "52 Willow Ave, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 15,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2016",
    status: "for_sale",
    type: "house",
    price: 962500,
    beds: 1, baths: 1, sqft: 920,
    year: 2013,
    address: "55 School St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 16,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2017",
    status: "for_rent",
    type: "condo",
    price: 3100,
    beds: 2, baths: 2, sqft: 938,
    year: 2014,
    address: "58 Jaques St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 17,
    openHouse: false,
    description: "Rental condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2018",
    status: "for_sale",
    type: "townhome",
    price: 907500,
    beds: 3, baths: 3, sqft: 956,
    year: 2015,
    address: "61 Evergreen Ave, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 18,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2019",
    status: "for_sale",
    type: "house",
    price: 1000000,
    beds: 4, baths: 1, sqft: 974,
    year: 2016,
    address: "64 Cedar St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 19,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2020",
    status: "for_sale",
    type: "condo",
    price: 802500,
    beds: 5, baths: 2, sqft: 992,
    year: 2017,
    address: "67 Oak St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 20,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2021",
    status: "for_rent",
    type: "townhome",
    price: 3800,
    beds: 1, baths: 3, sqft: 1010,
    year: 2018,
    address: "70 Broadway, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 21,
    openHouse: false,
    description: "Rental townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2022",
    status: "for_sale",
    type: "house",
    price: 1037500,
    beds: 2, baths: 1, sqft: 1028,
    year: 2019,
    address: "73 Highland Ave, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 1,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2023",
    status: "for_sale",
    type: "condo",
    price: 840000,
    beds: 3, baths: 2, sqft: 1046,
    year: 2020,
    address: "76 Beacon St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 2,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2024",
    status: "for_sale",
    type: "townhome",
    price: 982500,
    beds: 4, baths: 3, sqft: 1064,
    year: 2021,
    address: "79 Elm St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 3,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2025",
    status: "for_rent",
    type: "house",
    price: 2400,
    beds: 5, baths: 1, sqft: 1082,
    year: 2022,
    address: "82 Summer St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 4,
    openHouse: true,
    description: "Rental house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2026",
    status: "for_sale",
    type: "condo",
    price: 877500,
    beds: 1, baths: 2, sqft: 1100,
    year: 2023,
    address: "85 Washington St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 5,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2027",
    status: "for_sale",
    type: "townhome",
    price: 1020000,
    beds: 2, baths: 3, sqft: 1118,
    year: 2024,
    address: "88 Morrison Ave, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 6,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2028",
    status: "for_sale",
    type: "house",
    price: 1112500,
    beds: 3, baths: 1, sqft: 1136,
    year: 2025,
    address: "91 Bow St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 7,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2029",
    status: "for_rent",
    type: "condo",
    price: 3100,
    beds: 4, baths: 2, sqft: 1154,
    year: 1998,
    address: "94 Medford St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 8,
    openHouse: false,
    description: "Rental condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2030",
    status: "for_sale",
    type: "townhome",
    price: 1057500,
    beds: 5, baths: 3, sqft: 1172,
    year: 1999,
    address: "97 Lowell St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 9,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2031",
    status: "for_sale",
    type: "house",
    price: 1150000,
    beds: 1, baths: 1, sqft: 1190,
    year: 2000,
    address: "100 Walnut St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 10,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2032",
    status: "for_sale",
    type: "condo",
    price: 952500,
    beds: 2, baths: 2, sqft: 1208,
    year: 2001,
    address: "103 Central St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 11,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2033",
    status: "for_rent",
    type: "townhome",
    price: 3800,
    beds: 3, baths: 3, sqft: 1226,
    year: 2002,
    address: "106 Park St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 12,
    openHouse: false,
    description: "Rental townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2034",
    status: "for_sale",
    type: "house",
    price: 1187500,
    beds: 4, baths: 1, sqft: 1244,
    year: 2003,
    address: "109 Pearl St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 13,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2035",
    status: "for_sale",
    type: "condo",
    price: 990000,
    beds: 5, baths: 2, sqft: 1262,
    year: 2004,
    address: "112 Willow Ave, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 14,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2036",
    status: "for_sale",
    type: "townhome",
    price: 1132500,
    beds: 1, baths: 3, sqft: 1280,
    year: 2005,
    address: "115 School St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 15,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2037",
    status: "for_rent",
    type: "house",
    price: 2400,
    beds: 2, baths: 1, sqft: 1298,
    year: 2006,
    address: "118 Jaques St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 16,
    openHouse: true,
    description: "Rental house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2038",
    status: "for_sale",
    type: "condo",
    price: 1027500,
    beds: 3, baths: 2, sqft: 1316,
    year: 2007,
    address: "121 Evergreen Ave, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 17,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2039",
    status: "for_sale",
    type: "townhome",
    price: 1170000,
    beds: 4, baths: 3, sqft: 1334,
    year: 2008,
    address: "124 Cedar St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 18,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2040",
    status: "for_sale",
    type: "house",
    price: 1262500,
    beds: 5, baths: 1, sqft: 1352,
    year: 2009,
    address: "127 Oak St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 19,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2041",
    status: "for_rent",
    type: "condo",
    price: 3100,
    beds: 1, baths: 2, sqft: 1370,
    year: 2010,
    address: "130 Broadway, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 20,
    openHouse: false,
    description: "Rental condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2042",
    status: "for_sale",
    type: "townhome",
    price: 1207500,
    beds: 2, baths: 3, sqft: 1388,
    year: 2011,
    address: "133 Highland Ave, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 21,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2043",
    status: "for_sale",
    type: "house",
    price: 1300000,
    beds: 3, baths: 1, sqft: 1406,
    year: 2012,
    address: "136 Beacon St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 1,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2044",
    status: "for_sale",
    type: "condo",
    price: 1102500,
    beds: 4, baths: 2, sqft: 1424,
    year: 2013,
    address: "139 Elm St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 2,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2045",
    status: "for_rent",
    type: "townhome",
    price: 3800,
    beds: 5, baths: 3, sqft: 1442,
    year: 2014,
    address: "142 Summer St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 3,
    openHouse: false,
    description: "Rental townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2046",
    status: "for_sale",
    type: "house",
    price: 1337500,
    beds: 1, baths: 1, sqft: 1460,
    year: 2015,
    address: "145 Washington St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 4,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2047",
    status: "for_sale",
    type: "condo",
    price: 1140000,
    beds: 2, baths: 2, sqft: 1478,
    year: 2016,
    address: "148 Morrison Ave, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 5,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2048",
    status: "for_sale",
    type: "townhome",
    price: 1282500,
    beds: 3, baths: 3, sqft: 1496,
    year: 2017,
    address: "151 Bow St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 6,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2049",
    status: "for_rent",
    type: "house",
    price: 2400,
    beds: 4, baths: 1, sqft: 1514,
    year: 2018,
    address: "154 Medford St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 7,
    openHouse: true,
    description: "Rental house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2050",
    status: "for_sale",
    type: "condo",
    price: 1177500,
    beds: 5, baths: 2, sqft: 1532,
    year: 2019,
    address: "157 Lowell St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 8,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2051",
    status: "for_sale",
    type: "townhome",
    price: 1320000,
    beds: 1, baths: 3, sqft: 1550,
    year: 2020,
    address: "160 Walnut St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 9,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2052",
    status: "for_sale",
    type: "house",
    price: 1412500,
    beds: 2, baths: 1, sqft: 1568,
    year: 2021,
    address: "163 Central St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 10,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2053",
    status: "for_rent",
    type: "condo",
    price: 3100,
    beds: 3, baths: 2, sqft: 1586,
    year: 2022,
    address: "166 Park St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 11,
    openHouse: false,
    description: "Rental condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2054",
    status: "for_sale",
    type: "townhome",
    price: 1357500,
    beds: 4, baths: 3, sqft: 1604,
    year: 2023,
    address: "169 Pearl St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 12,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2055",
    status: "for_sale",
    type: "house",
    price: 1450000,
    beds: 5, baths: 1, sqft: 1622,
    year: 2024,
    address: "172 Willow Ave, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 13,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2056",
    status: "for_sale",
    type: "condo",
    price: 1252500,
    beds: 1, baths: 2, sqft: 1640,
    year: 2025,
    address: "175 School St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 14,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2057",
    status: "for_rent",
    type: "townhome",
    price: 3800,
    beds: 2, baths: 3, sqft: 1658,
    year: 1998,
    address: "178 Jaques St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 15,
    openHouse: false,
    description: "Rental townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2058",
    status: "for_sale",
    type: "house",
    price: 1487500,
    beds: 3, baths: 1, sqft: 1676,
    year: 1999,
    address: "181 Evergreen Ave, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 16,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2059",
    status: "for_sale",
    type: "condo",
    price: 1290000,
    beds: 4, baths: 2, sqft: 1694,
    year: 2000,
    address: "184 Cedar St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 17,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2060",
    status: "for_sale",
    type: "townhome",
    price: 1432500,
    beds: 5, baths: 3, sqft: 1712,
    year: 2001,
    address: "187 Oak St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 18,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2061",
    status: "for_rent",
    type: "house",
    price: 2400,
    beds: 1, baths: 1, sqft: 1730,
    year: 2002,
    address: "190 Broadway, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 19,
    openHouse: true,
    description: "Rental house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2062",
    status: "for_sale",
    type: "condo",
    price: 1327500,
    beds: 2, baths: 2, sqft: 1748,
    year: 2003,
    address: "193 Highland Ave, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 20,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2063",
    status: "for_sale",
    type: "townhome",
    price: 1470000,
    beds: 3, baths: 3, sqft: 1766,
    year: 2004,
    address: "196 Beacon St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 21,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2064",
    status: "for_sale",
    type: "house",
    price: 1562500,
    beds: 4, baths: 1, sqft: 1784,
    year: 2005,
    address: "199 Elm St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 1,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2065",
    status: "for_rent",
    type: "condo",
    price: 3100,
    beds: 5, baths: 2, sqft: 1802,
    year: 2006,
    address: "202 Summer St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 2,
    openHouse: false,
    description: "Rental condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2066",
    status: "for_sale",
    type: "townhome",
    price: 1507500,
    beds: 1, baths: 3, sqft: 1820,
    year: 2007,
    address: "205 Washington St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 3,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2067",
    status: "for_sale",
    type: "house",
    price: 1600000,
    beds: 2, baths: 1, sqft: 1838,
    year: 2008,
    address: "208 Morrison Ave, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 4,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2068",
    status: "for_sale",
    type: "condo",
    price: 1402500,
    beds: 3, baths: 2, sqft: 1856,
    year: 2009,
    address: "211 Bow St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 5,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2069",
    status: "for_rent",
    type: "townhome",
    price: 3800,
    beds: 4, baths: 3, sqft: 1874,
    year: 2010,
    address: "214 Medford St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 6,
    openHouse: false,
    description: "Rental townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2070",
    status: "for_sale",
    type: "house",
    price: 1637500,
    beds: 5, baths: 1, sqft: 1892,
    year: 2011,
    address: "217 Lowell St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 7,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2071",
    status: "for_sale",
    type: "condo",
    price: 1440000,
    beds: 1, baths: 2, sqft: 1910,
    year: 2012,
    address: "220 Walnut St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 8,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2072",
    status: "for_sale",
    type: "townhome",
    price: 1582500,
    beds: 2, baths: 3, sqft: 1928,
    year: 2013,
    address: "223 Central St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 9,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2073",
    status: "for_rent",
    type: "house",
    price: 2400,
    beds: 3, baths: 1, sqft: 1946,
    year: 2014,
    address: "226 Park St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 10,
    openHouse: true,
    description: "Rental house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2074",
    status: "for_sale",
    type: "condo",
    price: 1477500,
    beds: 4, baths: 2, sqft: 1964,
    year: 2015,
    address: "229 Pearl St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 11,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2075",
    status: "for_sale",
    type: "townhome",
    price: 1620000,
    beds: 5, baths: 3, sqft: 1982,
    year: 2016,
    address: "232 Willow Ave, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 12,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2076",
    status: "for_sale",
    type: "house",
    price: 1712500,
    beds: 1, baths: 1, sqft: 2000,
    year: 2017,
    address: "235 School St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 13,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2077",
    status: "for_rent",
    type: "condo",
    price: 3100,
    beds: 2, baths: 2, sqft: 2018,
    year: 2018,
    address: "238 Jaques St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 14,
    openHouse: false,
    description: "Rental condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2078",
    status: "for_sale",
    type: "townhome",
    price: 1657500,
    beds: 3, baths: 3, sqft: 2036,
    year: 2019,
    address: "241 Evergreen Ave, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 15,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2079",
    status: "for_sale",
    type: "house",
    price: 1750000,
    beds: 4, baths: 1, sqft: 2054,
    year: 2020,
    address: "244 Cedar St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 16,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2080",
    status: "for_sale",
    type: "condo",
    price: 1552500,
    beds: 5, baths: 2, sqft: 2072,
    year: 2021,
    address: "247 Oak St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 17,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2081",
    status: "for_rent",
    type: "townhome",
    price: 3800,
    beds: 1, baths: 3, sqft: 2090,
    year: 2022,
    address: "250 Broadway, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 18,
    openHouse: false,
    description: "Rental townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2082",
    status: "for_sale",
    type: "house",
    price: 1787500,
    beds: 2, baths: 1, sqft: 2108,
    year: 2023,
    address: "253 Highland Ave, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 19,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2083",
    status: "for_sale",
    type: "condo",
    price: 1590000,
    beds: 3, baths: 2, sqft: 2126,
    year: 2024,
    address: "256 Beacon St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 20,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2084",
    status: "for_sale",
    type: "townhome",
    price: 1732500,
    beds: 4, baths: 3, sqft: 2144,
    year: 2025,
    address: "259 Elm St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 21,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2085",
    status: "for_rent",
    type: "house",
    price: 2400,
    beds: 5, baths: 1, sqft: 2162,
    year: 1998,
    address: "262 Summer St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 1,
    openHouse: true,
    description: "Rental house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2086",
    status: "for_sale",
    type: "condo",
    price: 1627500,
    beds: 1, baths: 2, sqft: 2180,
    year: 1999,
    address: "265 Washington St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 2,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2087",
    status: "for_sale",
    type: "townhome",
    price: 1770000,
    beds: 2, baths: 3, sqft: 2198,
    year: 2000,
    address: "268 Morrison Ave, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 3,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2088",
    status: "for_sale",
    type: "house",
    price: 1862500,
    beds: 3, baths: 1, sqft: 2216,
    year: 2001,
    address: "271 Bow St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 4,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2089",
    status: "for_rent",
    type: "condo",
    price: 3100,
    beds: 4, baths: 2, sqft: 2234,
    year: 2002,
    address: "274 Medford St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 5,
    openHouse: false,
    description: "Rental condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2090",
    status: "for_sale",
    type: "townhome",
    price: 1807500,
    beds: 5, baths: 3, sqft: 2252,
    year: 2003,
    address: "277 Lowell St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 6,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2091",
    status: "for_sale",
    type: "house",
    price: 1900000,
    beds: 1, baths: 1, sqft: 2270,
    year: 2004,
    address: "280 Walnut St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 7,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2092",
    status: "for_sale",
    type: "condo",
    price: 1702500,
    beds: 2, baths: 2, sqft: 2288,
    year: 2005,
    address: "283 Central St, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 8,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2093",
    status: "for_rent",
    type: "townhome",
    price: 3800,
    beds: 3, baths: 3, sqft: 2306,
    year: 2006,
    address: "286 Park St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 9,
    openHouse: false,
    description: "Rental townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2094",
    status: "for_sale",
    type: "house",
    price: 1937500,
    beds: 4, baths: 1, sqft: 2324,
    year: 2007,
    address: "289 Pearl St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 10,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2095",
    status: "for_sale",
    type: "condo",
    price: 1740000,
    beds: 5, baths: 2, sqft: 2342,
    year: 2008,
    address: "292 Willow Ave, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 11,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2096",
    status: "for_sale",
    type: "townhome",
    price: 1882500,
    beds: 1, baths: 3, sqft: 2360,
    year: 2009,
    address: "295 School St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 12,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2097",
    status: "for_rent",
    type: "house",
    price: 2400,
    beds: 2, baths: 1, sqft: 2378,
    year: 2010,
    address: "298 Jaques St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 13,
    openHouse: true,
    description: "Rental house in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2098",
    status: "for_sale",
    type: "condo",
    price: 1777500,
    beds: 3, baths: 2, sqft: 2396,
    year: 2011,
    address: "301 Evergreen Ave, Somerville, MA 02144",
    city: "Somerville",
    daysOn: 14,
    openHouse: false,
    description: "For-sale condo in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2099",
    status: "for_sale",
    type: "townhome",
    price: 1920000,
    beds: 4, baths: 3, sqft: 2414,
    year: 2012,
    address: "304 Cedar St, Somerville, MA 02145",
    city: "Somerville",
    daysOn: 15,
    openHouse: false,
    description: "For-sale townhome in Somerville near transit, shops, and neighborhood parks.",
  },
  {
    id: "L-2100",
    status: "for_sale",
    type: "house",
    price: 2012500,
    beds: 5, baths: 1, sqft: 2432,
    year: 2013,
    address: "307 Oak St, Somerville, MA 02143",
    city: "Somerville",
    daysOn: 16,
    openHouse: true,
    description: "For-sale house in Somerville near transit, shops, and neighborhood parks.",
  },
];

// --- State ---
let statusFilter = "all";
let saved = new Set(JSON.parse(localStorage.getItem("savedHomes") || "[]"));
let activeListingId = null;
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

// --- Elements ---
const el = (id) => document.getElementById(id);
const cardsEl = el("cards");
const resultsMetaEl = el("resultsMeta");
const savedCountEl = el("savedCount");
const avgPriceEl = el("avgPrice");
const medianPriceEl = el("medianPrice");

// Inputs
const qEl = el("q");
const minPriceEl = el("minPrice");
const maxPriceEl = el("maxPrice");
const bedsEl = el("beds");
const bathsEl = el("baths");
const typeEl = el("type");
const openHouseEl = el("openHouse");
const hideSoldEl = el("hideSold");
const favoritesOnlyEl = el("favoritesOnly");
const sortEl = el("sort");

// Modal
const backdropEl = el("backdrop");
const modalTitleEl = el("modalTitle");
const modalPriceEl = el("modalPrice");
const modalAddrEl = el("modalAddr");
const modalFactsEl = el("modalFacts");
const modalDescEl = el("modalDesc");
const modalStatsEl = el("modalStats");
const modalSaveBtn = el("modalSaveBtn");

// Buttons
const resetBtn = el("resetBtn");
const newSearchBtn = el("newSearchBtn");
const centerBtn = el("centerBtn");
const closeModalBtn = el("closeModal");
const scheduleBtn = el("scheduleBtn");
const messageBtn = el("messageBtn");

// --- Helpers ---
const fmtMoney = (n, status) => {
  if (status === "for_rent") return `$${n.toLocaleString()}/mo`;
  if (n >= 1_000_000) return `$${(n/1_000_000).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
};

const normalizeSearchText = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const relevanceScore = (item, query) => {
  if (!query) return 0;
  const t = normalizeSearchText(query);
  const s = normalizeSearchText(item.address + " " + item.city + " " + item.type + " " + item.status);
  let score = 0;
  for (const token of t.split(/\s+/).filter(Boolean)){
    if (s.includes(token)) score += 2;
  }
  if (s.includes(t)) score += 3;
  return score;
};

const median = (arr) => {
  const a = [...arr].sort((x,y)=>x-y);
  const m = Math.floor(a.length/2);
  return a.length ? (a.length % 2 ? a[m] : (a[m-1]+a[m])/2) : null;
};

function persistSaved(){
  localStorage.setItem("savedHomes", JSON.stringify([...saved]));
  savedCountEl.textContent = saved.size;
}

function statusLabel(status){
  if (status === "for_sale") return "For Sale";
  if (status === "for_rent") return "For Rent";
  return "Sold";
}

function statusDotClass(status){
  if (status === "for_sale") return "sale";
  if (status === "for_rent") return "rent";
  return "sold";
}

// --- Filtering & sorting ---
function getFiltered(){
  const query = qEl.value.trim().toLowerCase();
  const normalizedQuery = normalizeSearchText(query);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const minP = Number(minPriceEl.value);
  const maxP = Number(maxPriceEl.value);
  const minBeds = Number(bedsEl.value);
  const minBaths = Number(bathsEl.value);
  const type = typeEl.value;
  const openOnly = openHouseEl.checked;
  const hideSold = hideSoldEl.checked;
  const favOnly = favoritesOnlyEl.checked;

  let items = listings.filter((x) => {
    if (statusFilter !== "all" && x.status !== statusFilter) return false;
    if (hideSold && x.status === "sold") return false;
    if (favOnly && !saved.has(x.id)) return false;

    if (x.price < minP) return false;
    if (x.price > maxP) return false;

    if (x.beds < minBeds) return false;
    if (x.baths < minBaths) return false;

    if (type !== "any" && x.type !== type) return false;
    if (openOnly && !x.openHouse) return false;

    if (queryTokens.length){
      const blob = normalizeSearchText(
        x.address + " " + x.city + " " + x.type + " " + statusLabel(x.status)
      );
      for (const token of queryTokens){
        if (!blob.includes(token)) return false;
      }
    }

    return true;
  });

  // sorting
  const sort = sortEl.value;
  if (sort === "price_asc") items.sort((a,b)=>a.price-b.price);
  else if (sort === "price_desc") items.sort((a,b)=>b.price-a.price);
  else if (sort === "newest") items.sort((a,b)=>a.daysOn-b.daysOn);
  else {
    items.sort((a,b)=>relevanceScore(b, query)-relevanceScore(a, query));
  }

  return items;
}

// --- Rendering ---
function render(){
  const items = getFiltered();
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = items.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const q = qEl.value.trim();
  resultsMetaEl.textContent = `Showing ${startIdx + 1}–${Math.min(startIdx + ITEMS_PER_PAGE, items.length)} of ${items.length} result${items.length===1?"":"s"}${q ? ` for "${q}"` : ""}`;

  const salePrices = items.filter(x=>x.status==="for_sale").map(x=>x.price);
  if (salePrices.length){
    const avg = salePrices.reduce((s,n)=>s+n,0)/salePrices.length;
    avgPriceEl.textContent = `Avg: ${fmtMoney(avg, "for_sale")}`;
    medianPriceEl.textContent = `Median: ${fmtMoney(median(salePrices), "for_sale")}`;
  } else {
    avgPriceEl.textContent = "Avg: —";
    medianPriceEl.textContent = "Median: —";
  }

  cardsEl.innerHTML = "";
  for (const x of pageItems){
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-id", x.id);

    const isSaved = saved.has(x.id);

    card.innerHTML = `
      <div class="img" style="background-image:url('${getImageUrl(x)}')">
        <div class="tag">
          <span class="dot ${statusDotClass(x.status)}"></span>
          ${statusLabel(x.status)}${x.openHouse ? " • Open house" : ""}
        </div>
        <button class="save" title="${isSaved ? "Unsave" : "Save"}" aria-label="save">
          ${isSaved ? "♥" : "♡"}
        </button>
      </div>
      <div class="card-body">
        <div class="price">${fmtMoney(x.price, x.status)}</div>
        <div class="addr">${x.address}</div>
        <div class="facts">
          <span class="fact">${x.beds} bd</span>
          <span class="fact">${x.baths} ba</span>
          <span class="fact">${x.sqft.toLocaleString()} sqft</span>
          <span class="fact">${x.type}</span>
        </div>
      </div>
    `;

    const saveBtn = card.querySelector(".save");
    saveBtn.addEventListener("click", (e)=>{
      e.stopPropagation();
      toggleSave(x.id);
      render();
    });

    card.addEventListener("click", ()=> openModal(x.id));
    cardsEl.appendChild(card);
  }

  // Pagination controls
  renderPagination(totalPages);

  persistSaved();
}

function renderPagination(totalPages){
  const paginationEl = el("pagination");
  paginationEl.innerHTML = "";
  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.className = "page-btn";
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", ()=>{ currentPage--; render(); scrollToCards(); });
  paginationEl.appendChild(prevBtn);

  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  if (start > 1){
    paginationEl.appendChild(createPageBtn(1));
    if (start > 2){
      const dots = document.createElement("span");
      dots.className = "page-dots";
      dots.textContent = "...";
      paginationEl.appendChild(dots);
    }
  }

  for (let i = start; i <= end; i++){
    paginationEl.appendChild(createPageBtn(i));
  }

  if (end < totalPages){
    if (end < totalPages - 1){
      const dots = document.createElement("span");
      dots.className = "page-dots";
      dots.textContent = "...";
      paginationEl.appendChild(dots);
    }
    paginationEl.appendChild(createPageBtn(totalPages));
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = "page-btn";
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", ()=>{ currentPage++; render(); scrollToCards(); });
  paginationEl.appendChild(nextBtn);
}

function createPageBtn(page){
  const btn = document.createElement("button");
  btn.className = "page-btn" + (page === currentPage ? " active" : "");
  btn.textContent = page;
  btn.addEventListener("click", ()=>{ currentPage = page; render(); scrollToCards(); });
  return btn;
}

function scrollToCards(){
  document.querySelector(".list-head").scrollIntoView({behavior:"smooth"});
}

function toggleSave(id){
  if (saved.has(id)) saved.delete(id);
  else saved.add(id);
  persistSaved();
}

// --- Modal logic ---
function openModal(id){
  activeListingId = id;
  const x = listings.find(z=>z.id===id);
  if (!x) return;

  const imgUrl = getImageUrl(x);

  modalTitleEl.textContent = `${statusLabel(x.status)} • ${x.type.toUpperCase()} • ${x.id}`;
  modalPriceEl.textContent = fmtMoney(x.price, x.status);
  modalAddrEl.textContent = x.address;

  // Show property image in modal
  const modalImgEl = el("modalImg");
  modalImgEl.style.backgroundImage = `url('${imgUrl}')`;

  modalFactsEl.innerHTML = `
    <span class="fact">${x.beds} bd</span>
    <span class="fact">${x.baths} ba</span>
    <span class="fact">${x.sqft.toLocaleString()} sqft</span>
    <span class="fact">Built ${x.year}</span>
    <span class="fact">${x.openHouse ? "Open house" : "No open house"}</span>
  `;

  modalDescEl.textContent = x.description;

  modalStatsEl.innerHTML = `
    <div class="badge"><span>Status</span><strong>${statusLabel(x.status)}</strong></div>
    <div class="badge"><span>Days on market</span><strong>${x.daysOn ? x.daysOn + " days" : "—"}</strong></div>
    <div class="badge"><span>City</span><strong>${x.city}</strong></div>
    <div class="badge"><span>Type</span><strong>${x.type}</strong></div>
  `;

  // TM model prediction
  const predictionEl = el("tmPrediction");
  predictionEl.innerHTML = '<span class="pred-loading">Analyzing image...</span>';

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgUrl;
  img.onload = async () => {
    const predictions = await classifyImage(img);
    if (predictions) {
      predictionEl.innerHTML = predictions.map(p => {
        const pct = (p.probability * 100).toFixed(1);
        return `<div class="pred-row">
          <span class="pred-label">${p.className}</span>
          <div class="pred-bar-bg"><div class="pred-bar" style="width:${pct}%"></div></div>
          <span class="pred-pct">${pct}%</span>
        </div>`;
      }).join("");
    } else {
      predictionEl.innerHTML = '<span class="pred-loading">Model not loaded</span>';
    }
  };
  img.onerror = () => {
    predictionEl.innerHTML = '<span class="pred-loading">Could not load image</span>';
  };

  modalSaveBtn.textContent = saved.has(id) ? "♥ Saved" : "♡ Save";
  backdropEl.classList.add("show");
  backdropEl.setAttribute("aria-hidden", "false");
}

function closeModal(){
  backdropEl.classList.remove("show");
  backdropEl.setAttribute("aria-hidden", "true");
  activeListingId = null;
}

// --- Events ---
document.querySelectorAll(".seg button").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".seg button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    statusFilter = btn.dataset.status;
    currentPage = 1;
    render();
  });
});

[qEl, minPriceEl, maxPriceEl, bedsEl, bathsEl, typeEl, openHouseEl, hideSoldEl, favoritesOnlyEl, sortEl].forEach(node=>{
  node.addEventListener("input", ()=>{ currentPage = 1; render(); });
  node.addEventListener("change", ()=>{ currentPage = 1; render(); });
});

resetBtn.addEventListener("click", ()=>{
  qEl.value = "";
  minPriceEl.value = "0";
  maxPriceEl.value = "999999999";
  bedsEl.value = "0";
  bathsEl.value = "0";
  typeEl.value = "any";
  openHouseEl.checked = false;
  hideSoldEl.checked = true;
  favoritesOnlyEl.checked = false;
  sortEl.value = "relevance";

  statusFilter = "all";
  document.querySelectorAll(".seg button").forEach(b=>b.classList.remove("active"));
  document.querySelector('.seg button[data-status="all"]').classList.add("active");

  currentPage = 1;
  render();
});

newSearchBtn.addEventListener("click", ()=>{
  render();
  window.scrollTo({top: 0, behavior:"smooth"});
});

centerBtn.addEventListener("click", ()=>{
  alert("Demo: Map centering would happen here (Mapbox/Google Maps).");
});

closeModalBtn.addEventListener("click", closeModal);
backdropEl.addEventListener("click", (e)=>{
  if (e.target === backdropEl) closeModal();
});
window.addEventListener("keydown", (e)=>{
  if (e.key === "Escape") closeModal();
});

modalSaveBtn.addEventListener("click", ()=>{
  if (!activeListingId) return;
  toggleSave(activeListingId);
  modalSaveBtn.textContent = saved.has(activeListingId) ? "♥ Saved" : "♡ Save";
  render();
});

scheduleBtn.addEventListener("click", ()=>{
  alert("Demo: This would open a scheduling flow (calendar + contact info).");
});
messageBtn.addEventListener("click", ()=>{
  alert("Demo: This would open a message form to the agent.");
});

// Initial render
persistSaved();
render();

// Load Teachable Machine model
loadTMModel();
