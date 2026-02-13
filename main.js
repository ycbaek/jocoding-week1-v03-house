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
];

// --- State ---
let statusFilter = "all";
let saved = new Set(JSON.parse(localStorage.getItem("savedHomes") || "[]"));
let activeListingId = null;

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

const relevanceScore = (item, query) => {
  if (!query) return 0;
  const t = query.toLowerCase();
  const s = (item.address + " " + item.city + " " + item.type + " " + item.status).toLowerCase();
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

    if (query){
      const blob = (x.address + " " + x.city + " " + x.type + " " + statusLabel(x.status)).toLowerCase();
      for (const token of query.split(/\s+/).filter(Boolean)){
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

  const q = qEl.value.trim();
  resultsMetaEl.textContent = `Showing ${items.length} result${items.length===1?"":"s"}${q ? ` for "${q}"` : ""}`;

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
  for (const x of items){
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-id", x.id);

    const isSaved = saved.has(x.id);

    card.innerHTML = `
      <div class="img">
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

  persistSaved();
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

  modalTitleEl.textContent = `${statusLabel(x.status)} • ${x.type.toUpperCase()} • ${x.id}`;
  modalPriceEl.textContent = fmtMoney(x.price, x.status);
  modalAddrEl.textContent = x.address;

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
    render();
  });
});

[qEl, minPriceEl, maxPriceEl, bedsEl, bathsEl, typeEl, openHouseEl, hideSoldEl, favoritesOnlyEl, sortEl].forEach(node=>{
  node.addEventListener("input", render);
  node.addEventListener("change", render);
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
