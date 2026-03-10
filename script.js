// ═══ SCROLL REVEAL ═══
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ═══ PROGRESS BAR ═══
const progressBar = document.getElementById('progressBar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

// ═══ DAY NAV ═══
const dayNav = document.getElementById('dayNav');
const dayLinks = document.querySelectorAll('.day-nav-link');
const daySections = document.querySelectorAll('.day-section');

function updateNav() {
  const scrollY = window.scrollY;
  if (scrollY > window.innerHeight * 0.7) {
    dayNav.classList.add('visible');
  } else {
    dayNav.classList.remove('visible');
  }
  let activeDay = '0';
  daySections.forEach(section => {
    if (scrollY >= section.offsetTop - 100) {
      activeDay = section.id.replace('day', '');
    }
  });
  dayLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.day === activeDay);
  });
}
window.addEventListener('scroll', updateNav, { passive: true });

dayLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ═══ ANIMATED COUNTER ═══
function animateCounter(el) {
  const targetRaw = el.dataset.target;
  const target = parseInt(targetRaw);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';

  if (isNaN(target)) {
    el.textContent = prefix + targetRaw + suffix;
    return;
  }

  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    el.textContent = prefix + (target === 0 && progress > 0.5 ? '0' : current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-val').forEach(el => statObserver.observe(el));

// ═══ PARALLAX HERO ═══
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
    heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
  }
}, { passive: true });

// ═══ ELEVATION CHART ANIMATION ═══
const elevObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.3 });
const elevSection = document.querySelector('.elevation');
if (elevSection) elevObserver.observe(elevSection);

// ═══ LEAFLET MAPS ═══
const svgIcons = {
  camp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M12 3l9 18M12 3L3 21m9-18v18"/></svg>`,
  food: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>`,
  swim: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12c-2.66 0-2.66-2-5.33-2-2.66 0-2.66 2-5.33 2-2.66 0-2.66-2-5.33-2-2.66 0-2.66 2-5.34 2M22 18c-2.66 0-2.66-2-5.33-2-2.66 0-2.66 2-5.33 2-2.66 0-2.66-2-5.33-2-2.66 0-2.66 2-5.34 2"/></svg>`,
  park: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  ferry: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0M2 15h20l-1-6H3l-1 6z"/><path d="M10 9V5"/><path d="M14 9V5"/><path d="M7 5h10"/></svg>`,
  bike: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></svg>`,
  bridge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V8a8 8 0 0 1 16 0v14M2 14h20M2 18h20m-13-4v8m6-8v8"/></svg>`,
  point: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/></svg>`,
  finish: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg>`
};

const trailColor = '#3a8c3f';
const roadColor = '#c47a1a';
const ferryColor = '#2980b9';

function makeIcon(type, size) {
  const s = size || 16;
  const discSize = s + 14;
  const svg = svgIcons[type] || svgIcons.point;
  return L.divIcon({
    html: `<div class="marker-inner marker-hidden" style="width:${discSize}px;height:${discSize}px;background:#1a1a1a;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.4);border:2px solid #fff;"><div style="width:${s}px;height:${s}px;color:#fff">${svg}</div></div>`,
    className: 'svg-marker',
    iconSize: [discSize, discSize],
    iconAnchor: [discSize / 2, discSize / 2]
  });
}

function addMarker(map, latlng, icon, popup) {
  return L.marker(latlng, { icon: icon }).bindPopup(popup).addTo(map);
}

function addRoute(map, coords, color, dashed) {
  L.polyline(coords, {
    color: '#000', weight: 8, opacity: 0.2,
    lineCap: 'round', lineJoin: 'round'
  }).addTo(map);
  L.polyline(coords, {
    color: color, weight: 5, opacity: 0.9,
    dashArray: dashed ? '8,8' : null,
    lineCap: 'round', lineJoin: 'round'
  }).addTo(map);
}

function popMapMarkers(map, dayId) {
  const daySection = document.getElementById(dayId);
  const timelineSVGs = daySection ? Array.from(daySection.querySelectorAll('.timeline-svg')) : [];
  const markerEls = Array.from(map.getPane('markerPane').querySelectorAll('.marker-inner'));
  const SPREAD = 1500;
  const perMarker = markerEls.length > 0 ? SPREAD / markerEls.length : 500;
  markerEls.forEach((el, idx) => {
    setTimeout(() => {
      el.classList.remove('marker-hidden');
      el.classList.add('marker-pop');
      if (timelineSVGs[idx]) timelineSVGs[idx].classList.add('marker-pop');
    }, idx * perMarker);
  });
}

// Initialize maps when they scroll into view
const mapConfigs = {
  'leaflet-map0': null, 'leaflet-map1': null,
  'leaflet-map2': null, 'leaflet-map3': null, 'leaflet-map4': null
};

function initMapContents(map, dayId, addContentFn) {
  mapConfigs[map.getContainer().id] = map;
  // Double invalidateSize + 600ms timeout guarantees the container is at its
  // true pixel size before Leaflet projects coordinates into SVG points.
  map.invalidateSize();
  setTimeout(() => {
    map.invalidateSize();
    addContentFn(map);
    // Pop markers 400ms after routes are added
    setTimeout(() => popMapMarkers(map, dayId), 400);
  }, 600);
}

function createMap(id, center, zoom, boundsArr) {
  const map = L.map(id, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: false
  }).setView(center, zoom);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 17,
  }).addTo(map);

  L.control.attribution({ prefix: false, position: 'bottomright' })
    .addAttribution('© <a href="https://carto.com">CartoDB</a>')
    .addTo(map);

  if (boundsArr) {
    map.fitBounds(boundsArr, { padding: [40, 40] });
  }

  return map;
}

const mapInitObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !mapConfigs[entry.target.id]) {
      initMap(entry.target.id);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[id^="leaflet-map"]').forEach(el => {
  mapInitObserver.observe(el);
});

function initMap(id) {
  switch (id) {
    case 'leaflet-map0': initMap0(); break;
    case 'leaflet-map1': initMap1(); break;
    case 'leaflet-map2': initMap2(); break;
    case 'leaflet-map3': initMap3(); break;
    case 'leaflet-map4': initMap4(); break;
  }
}

// MAP 0: Night Before — Burlington / North Beach
function initMap0() {
  const map = createMap('leaflet-map0', [44.49, -73.24], 13,
    [[44.475, -73.28], [44.56, -73.20]]);
  initMapContents(map, 'day0', m => {
    addMarker(m, [44.4947, -73.2358], makeIcon('camp', 24), '<b>North Beach Campground</b><br>69 tent sites on Lake Champlain.<br>Bike path to downtown & Island Line.')
    addMarker(m, [44.4770, -73.2210], makeIcon('food', 20), '<b>Church Street / Waterfront</b><br>Restaurants, bars, City Market co-op')
    addMarker(m, [44.5530, -73.2750], makeIcon('park', 18), '<b>Airport Park</b><br>Day 1 start. 10 min ride from North Beach.')
    addRoute(m, [
      [44.4947, -73.2358], [44.4950, -73.2420], [44.5100, -73.2500],
      [44.5250, -73.2600], [44.5400, -73.2700], [44.5530, -73.2750]
    ], trailColor, false);
  });
}

// MAP 1: The Lake Crossing
function initMap1() {
  const map = createMap('leaflet-map1', [44.65, -73.10], 10,
    [[44.55, -73.32], [44.82, -72.80]]);
  initMapContents(map, 'day1', m => {
    addRoute(m, [
      [44.5530, -73.2750], [44.5700, -73.2800], [44.5880, -73.2870],
      [44.6050, -73.2950], [44.6180, -73.3050]
    ], trailColor, false);
    addRoute(m, [[44.6180, -73.3050], [44.6340, -73.3000]], ferryColor, true);
    addRoute(m, [
      [44.6340, -73.3000], [44.6600, -73.2950], [44.7050, -73.2880],
      [44.7400, -73.2500], [44.7800, -73.1800], [44.8110, -73.0830]
    ], roadColor, true);
    addRoute(m, [[44.8110, -73.0830], [44.8020, -72.9630]], roadColor, true);
    addRoute(m, [
      [44.8020, -72.9630], [44.7660, -72.8370],
      [44.6440, -72.8760], [44.6460, -72.8310]
    ], trailColor, false);
    addRoute(m, [[44.6460, -72.8310], [44.6270, -72.8130]], roadColor, true);
    addMarker(m, [44.5530, -73.2750], makeIcon('park', 22), '<b>Airport Park</b><br>Start here! Free parking.')
    addMarker(m, [44.6180, -73.3050], makeIcon('ferry', 22), '<b>Bike Ferry</b><br>$8 RT, seasonal 10a-6p')
    addMarker(m, [44.7050, -73.2880], makeIcon('food', 20), '<b>Hero\'s Welcome</b><br>General store, amazing sandwiches')
    addMarker(m, [44.8110, -73.0830], makeIcon('food', 18), '<b>St. Albans</b><br>Resupply, connect to LVRT')
    addMarker(m, [44.6440, -72.8760], makeIcon('bridge', 18), '<b>Cambridge Junction</b><br>Covered bridge')
    addMarker(m, [44.6270, -72.8130], makeIcon('camp', 24), '<b>Brewster River Campground</b><br>Night 1. Waterfall, swimming hole, fireflies.')
  });
}

// MAP 2: Into the Kingdom
function initMap2() {
  const map = createMap('leaflet-map2', [44.48, -72.50], 10,
    [[44.27, -72.90], [44.66, -72.10]]);
  initMapContents(map, 'day2', m => {
    addRoute(m, [[44.6270, -72.8130], [44.6440, -72.8760]], roadColor, true);
    addRoute(m, [
      [44.6440, -72.8760], [44.6330, -72.7950], [44.5910, -72.6590],
      [44.5730, -72.6350], [44.5620, -72.5980], [44.5570, -72.5920],
      [44.5520, -72.5100], [44.5050, -72.3680], [44.4100, -72.1400]
    ], trailColor, false);
    addRoute(m, [
      [44.4100, -72.1400], [44.3800, -72.1600],
      [44.3300, -72.1800], [44.2980, -72.2050]
    ], roadColor, true);
    addMarker(m, [44.6270, -72.8130], makeIcon('camp', 20), '<b>Brewster River</b><br>Day 2 start')
    addMarker(m, [44.6330, -72.7950], makeIcon('swim', 18), '<b>Poland Covered Bridge</b><br>Sandbar swimming (Komoot pick)')
    addMarker(m, [44.5620, -72.5980], makeIcon('food', 20), '<b>Lost Nation Brewing</b><br>Thu-Sun only, noon-7p')
    addMarker(m, [44.5730, -72.6350], makeIcon('food', 18), '<b>Two Son\'s Bakehouse</b><br>Hyde Park (Komoot pick)')
    addMarker(m, [44.5520, -72.5100], makeIcon('bridge', 18), '<b>Fisher Covered Bridge</b><br>Last covered railroad bridge in VT')
    addMarker(m, [44.5050, -72.3680], makeIcon('food', 20), '<b>Front Seat Coffee</b><br>Cardamom rose lattes, 7a-3p')
    addMarker(m, [44.5150, -72.3200], makeIcon('food', 16), '<b>Hill Farmstead detour</b><br>Best brewery in the world (Komoot pick)')
    addMarker(m, [44.4100, -72.1400], makeIcon('point', 16), '<b>Danville</b><br>Turn south on VT-232')
    addMarker(m, [44.2980, -72.2050], makeIcon('camp', 24), '<b>New Discovery State Park</b><br>Night 2. CCC lean-tos, stone fireplaces.')
  });
}

// MAP 3: The Easy Return
function initMap3() {
  const map = createMap('leaflet-map3', [44.48, -72.45], 10,
    [[44.28, -72.70], [44.62, -72.10]]);
  initMapContents(map, 'day3', m => {
    addRoute(m, [
      [44.2980, -72.2050], [44.3300, -72.1800],
      [44.3800, -72.1600], [44.4100, -72.1400]
    ], roadColor, true);
    addRoute(m, [
      [44.4100, -72.1400], [44.5050, -72.3680],
      [44.5520, -72.5100], [44.5620, -72.5980],
      [44.5730, -72.6350], [44.5900, -72.6500]
    ], trailColor, false);
    addRoute(m, [
      [44.5570, -72.5920], [44.5350, -72.5280], [44.5220, -72.5160]
    ], roadColor, true);
    addMarker(m, [44.2980, -72.2050], makeIcon('camp', 20), '<b>New Discovery</b><br>Day 3 start')
    addMarker(m, [44.5900, -72.6500], makeIcon('swim', 20), '<b>Dog\'s Head Falls</b><br>River swimming, sandy bottoms')
    addMarker(m, [44.5220, -72.5160], makeIcon('camp', 24), '<b>Elmore State Park</b><br>Night 3. Sandy beach, fire tower.')
  });
}

// MAP 4: Back Across the Lake
function initMap4() {
  const map = createMap('leaflet-map4', [44.63, -73.05], 10,
    [[44.50, -73.32], [44.82, -72.50]]);
  initMapContents(map, 'day4', m => {
    addRoute(m, [[44.5220, -72.5160], [44.5570, -72.5920]], roadColor, true);
    addRoute(m, [
      [44.5570, -72.5920], [44.5620, -72.5980],
      [44.6440, -72.8760], [44.8020, -72.9630]
    ], trailColor, false);
    addRoute(m, [[44.8020, -72.9630], [44.8110, -73.0830]], roadColor, true);
    addRoute(m, [
      [44.8110, -73.0830], [44.7800, -73.1800],
      [44.7050, -73.2880], [44.6340, -73.3000]
    ], roadColor, true);
    addRoute(m, [[44.6340, -73.3000], [44.6180, -73.3050]], ferryColor, true);
    addRoute(m, [
      [44.6180, -73.3050], [44.6050, -73.2950],
      [44.5880, -73.2870], [44.5530, -73.2750]
    ], trailColor, false);
    addMarker(m, [44.5220, -72.5160], makeIcon('camp', 18), '<b>Elmore</b><br>Day 4 start')
    addMarker(m, [44.5620, -72.5980], makeIcon('food', 18), '<b>Morrisville Coffee</b>')
    addMarker(m, [44.8110, -73.0830], makeIcon('food', 18), '<b>St. Albans</b><br>Last meal before the lake')
    addMarker(m, [44.6180, -73.3050], makeIcon('ferry', 20), '<b>Bike Ferry</b><br>Return crossing')
    addMarker(m, [44.5530, -73.2750], makeIcon('finish', 24), '<b>Airport Park — FINISH!</b><br>Victory swim!')
  });
}

