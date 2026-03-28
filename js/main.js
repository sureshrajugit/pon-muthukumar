
const photos = [
  { src:"images/gallery1.jpeg", title:"குடும்பம்", year:"2023", category:"family" },
  { src:"images/gallery2.jpeg", title:"தம்பதிகள்", year:"1990", category:"couple" },
  { src:"images/gallery3.jpeg", title:"பயணங்கள்", year:"1995", category:"travel" },
  { src:"images/gallery4.jpeg", title:"தம்பியுடன்", year:"2000", category:"family" },
  { src:"images/gallery5.jpeg", title:"குடும்பம்", year:"2002", category:"family" },
  { src:"images/gallery6.jpeg", title:"தம்பதிகள்", year:"2008", category:"couple" },
  { src:"images/gallery7.jpeg", title:"கடற்கரையில்", year:"2010", category:"couple" },
  { src:"images/gallery8.jpeg", title:"குடும்பம்", year:"2012", category:"travel" },
  { src:"images/gallery25.jpg", title:"essay writtten", year:"2014", category:"poetry" },
  { src:"images/gallery10.jpeg", title:"குடும்பம்", year:"2016", category:"couple" },
  { src:"images/gallery11.jpeg", title:"Grandchildren", year:"2018", category:"family" },
  { src:"images/gallery12.jpeg", title:"cake cutting", year:"2023", category:"couple" },
  { src:"images/gallery13.jpeg", title:"Old friends", year:"1988", category:"family" },
  { src:"images/gallery14.jpeg", title:"Goa holiday", year:"1997", category:"travel" },
  { src:"images/gallery26.jpg", title:"Writing session", year:"2006", category:"poetry" },
  { src:"images/gallery16.jpeg", title:"family gathering", year:"2015", category:"couple" },
  { src:"images/gallery17.jpeg", title:"family time", year:"2019", category:"family" },
  { src:"images/gallery18.jpeg", title:"பயணங்கள்", year:"2003", category:"travel" },
  { src:"images/gallery19.jpeg", title:"Grandchildren", year:"1993", category:"family" },
  { src:"images/gallery27.jpg", title:"Poem writtten", year:"2011", category:"poetry" },
  { src:"images/gallery21.jpeg", title:"holiday", year:"2020", category:"couple" },
  { src:"images/gallery22.jpeg", title:"holiday", year:"2022", category:"family" },
  { src:"images/gallery23.jpeg", title:"Old friends", year:"1999", category:"travel" },
  { src:"images/gallery28.jpg", title:"essay writtten", year:"2007", category:"poetry" },
];

/* ─── state ─── */
let allPhotos = [...photos];
let filtered  = [...photos];
let currentIndex = 0;
let currentFilter = 'all';
let playInterval = null;
let isPlaying = false;
let speed = 4000;
let currentPage = 1;
const PER_PAGE = 12;

/* ─── init ─── */
function init() {
  buildCarousel(filtered);
  buildGrid();
  buildPageNav();
}

/* ─── carousel ─── */
function buildCarousel(list) {
  const stage = document.getElementById('stage');
  // remove old slides
  stage.querySelectorAll('.slide, .slide-placeholder').forEach(el => el.remove());

  list.forEach((p, i) => {
    let el;
    if (p.src) {
      el = document.createElement('img');
      el.src = p.src;
      el.alt = p.title;
      el.className = 'slide';
    } else {
      el = document.createElement('div');
      el.className = 'slide-placeholder';
      el.innerHTML = `
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8">
          <rect x="3" y="3" width="18" height="18" rx="1"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        <span style="font-size:0.65rem;letter-spacing:0.15em;">${p.title}</span>
      `;
    }
    el.dataset.index = i;
    stage.insertBefore(el, stage.querySelector('.carousel-btn.prev'));
  });

  buildThumbs(list);
  goToSlide(0);
}

function buildThumbs(list) {
  const strip = document.getElementById('thumbStrip');
  strip.innerHTML = '';
  list.forEach((p, i) => {
    const t = document.createElement('div');
    t.className = 'thumb' + (i === 0 ? ' active' : '');
    t.onclick = () => goToSlide(i);
    t.innerHTML = p.src
      ? `<img src="${p.src}" alt="${p.title}">`
      : `<div class="thumb-placeholder">${i+1}</div>`;
    strip.appendChild(t);
  });
}

function goToSlide(idx) {
  const slides = document.getElementById('stage').querySelectorAll('.slide-placeholder, img.slide');
  const thumbs = document.getElementById('thumbStrip').querySelectorAll('.thumb');
  slides.forEach(s => s.classList.remove('active'));
  thumbs.forEach(t => t.classList.remove('active'));
  currentIndex = (idx + filtered.length) % filtered.length;
  if (slides[currentIndex]) slides[currentIndex].classList.add('active');
  if (thumbs[currentIndex]) {
    thumbs[currentIndex].classList.add('active');
    thumbs[currentIndex].scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
  }
  const p = filtered[currentIndex];
  document.getElementById('counter').textContent = (currentIndex+1) + ' / ' + filtered.length;
  document.getElementById('captionTitle').textContent = p.title;
  document.getElementById('captionMeta').textContent = p.category.charAt(0).toUpperCase()+p.category.slice(1) + ' · ' + p.year;
}

function changeSlide(dir) { goToSlide(currentIndex + dir); }

function togglePlay() {
  isPlaying = !isPlaying;
  const btn = document.getElementById('playBtn');
  if (isPlaying) {
    btn.innerHTML = `<svg width="10" height="11" viewBox="0 0 10 10" fill="currentColor"><rect x="0" y="0" width="3.5" height="10"/><rect x="6.5" y="0" width="3.5" height="10"/></svg> Pause`;
    playInterval = setInterval(() => changeSlide(1), speed);
  } else {
    btn.innerHTML = `<svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor"><path d="M0 0l10 5.5L0 11z"/></svg> Slideshow`;
    clearInterval(playInterval);
  }
}

function updateSpeed() {
  speed = parseInt(document.getElementById('speedSelect').value);
  if (isPlaying) { clearInterval(playInterval); playInterval = setInterval(() => changeSlide(1), speed); }
}

/* ─── grid + pagination ─── */
function buildGrid() {
  const grid = document.getElementById('photoGrid');
  grid.innerHTML = '';
  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);
  pageItems.forEach((p, localIdx) => {
    const globalIdx = start + localIdx;
    const item = document.createElement('div');
    item.className = 'grid-item';
    item.onclick = () => openLightbox(globalIdx);
    item.innerHTML = p.src
      ? `<img src="${p.src}" alt="${p.title}"><div class="hover-label"><span>${p.title}</span></div>`
      : `<div class="grid-item-placeholder"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8"><rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span style="font-size:0.58rem;letter-spacing:0.08em;">${p.title}</span></div><div class="hover-label"><span>${p.title}</span></div>`;
    grid.appendChild(item);
  });

  const label = document.getElementById('gridLabel');
  label.textContent = 'Showing ' + filtered.length + ' photo' + (filtered.length !== 1 ? 's' : '') + (currentFilter !== 'all' ? ' · ' + currentFilter : '');
}

function buildPageNav() {
  const nav = document.getElementById('pageNav');
  nav.innerHTML = '';
  const total = Math.ceil(filtered.length / PER_PAGE);
  if (total <= 1) return;

  const prev = document.createElement('button');
  prev.className = 'page-btn'; prev.textContent = '←';
  prev.disabled = currentPage === 1;
  prev.onclick = () => goToPage(currentPage - 1);
  nav.appendChild(prev);

  for (let i = 1; i <= total; i++) {
    if (total > 7 && i > 2 && i < total - 1 && Math.abs(i - currentPage) > 1) {
      if (i === 3 || i === total - 2) {
        const dots = document.createElement('button');
        dots.className = 'page-btn'; dots.textContent = '…'; dots.disabled = true;
        nav.appendChild(dots);
      }
      continue;
    }
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
    btn.textContent = i;
    btn.onclick = () => goToPage(i);
    nav.appendChild(btn);
  }

  const next = document.createElement('button');
  next.className = 'page-btn'; next.textContent = '→';
  next.disabled = currentPage === total;
  next.onclick = () => goToPage(currentPage + 1);
  nav.appendChild(next);
}

function goToPage(p) {
  currentPage = p;
  buildGrid();
  buildPageNav();
  document.querySelector('.grid-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── filter ─── */
function filterPhotos(cat, btn) {
  currentFilter = cat;
  filtered = cat === 'all' ? [...allPhotos] : allPhotos.filter(p => p.category === cat);
  currentPage = 1;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (isPlaying) togglePlay();
  buildCarousel(filtered);
  buildGrid();
  buildPageNav();
}


init();

function navTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
}
