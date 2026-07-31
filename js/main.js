/* ═══════════════════════════════════════════════════════════
   RP CALHAS — main.js
   ═══════════════════════════════════════════════════════════ */

// ── DADOS DA GALERIA ─────────────────────────────────────
// Lista flat. Para adicionar foto: só empurrar um objeto novo aqui.
// O carrossel se reorganiza sozinho em páginas de 6 (3 colunas × 2 linhas).
const galleryData = [
  { src: 'assets/cobertura05.jpeg', label: 'Cobertura com telha termo acústica tipo forro e vidro laminado — Garagem', category: 'retratil' },
  { src: 'assets/cobertura04.jpeg', label: 'Vista superior — Telhado com telha termo acústica tipo forro e vidro laminado', category: 'retratil' },
  { src: 'assets/cobertura03.jpeg', label: 'Estrutura metálica com pintura eletrostática em preto e telha termo acústica tipo forro ', category: 'retratil' },
  { src: 'assets/telhado-vidro-retratil.jpeg', label: 'Telhado retrátil para área de lazer', category: 'retratil' },
  { src: 'assets/calha-3.jpeg', label: 'Calha sob medida em aço galvanizado', category: 'calhas' },
  { src: 'assets/retratil.jpeg', label: 'Vista superior - Telhado retrátil com vidro laminado ', category: 'retratil' },
  { src: 'assets/rufo-1.jpeg', label: 'Rufo em aço galvanizado', category: 'rufos' },
  { src: 'assets/condutor-1.jpeg', label: 'Condutor pluvial em aço galvanizado', category: 'calhas' },
  { src: 'assets/imp.jpeg', label: 'Impermeabilização de laje residencial', category: 'impermeabilizacao' },
  { src: 'assets/calha-2.jpeg', label: 'Calha em aço galvanizado pintado — Residencial', category: 'calhas' },
  { src: 'assets/rufo-2.jpeg', label: 'Rufo em aço galvanizado pintado — Residencial', category: 'rufos' },
  { src: 'assets/calhas-1.jpeg', label: 'Calha em aço galvanizado pintado — Residencial', category: 'calhas' },
];

// ── ESTADO DO CARROSSEL ───────────────────────────────────
const PAGE_SIZE = 6; // 3 colunas × 2 linhas
let currentFilter = 'all';
let filteredItems = [];
let currentPage = 0;
let currentLightboxIndex = 0;

// ── FILTRAGEM ──────────────────────────────────────────────
function getFilteredItems() {
  return currentFilter === 'all'
    ? galleryData
    : galleryData.filter(item => item.category === currentFilter);
}

// ── RENDER DO CARROSSEL ──────────────────────────────────
function renderCarousel() {
  filteredItems = getFilteredItems();
  currentPage = 0;

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const track = document.getElementById('galleryTrack');

  track.innerHTML = Array.from({ length: totalPages }).map((_, pageIndex) => {
    const pageItems = filteredItems.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE);

    const itemsHtml = pageItems.map((item, i) => {
      const flatIndex = pageIndex * PAGE_SIZE + i; // índice dentro de filteredItems
      return `
        <div class="gallery-item" onclick="openLightbox(${flatIndex})">
          <img src="${item.src}" alt="${item.label}">
          <div class="gallery-overlay">
            <div class="gallery-label">${item.label}</div>
            <div class="gallery-zoom">⤢</div>
          </div>
        </div>
      `;
    }).join('');

    return `<div class="gallery-page">${itemsHtml}</div>`;
  }).join('');

  updateCarouselUI(totalPages);
}

function updateCarouselUI(totalPages) {
  const track = document.getElementById('galleryTrack');
  track.style.transform = `translateX(-${currentPage * 100}%)`;

  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const showArrows = totalPages > 1;

  prevBtn.style.visibility = showArrows ? 'visible' : 'hidden';
  nextBtn.style.visibility = showArrows ? 'visible' : 'hidden';
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === totalPages - 1;

  const dotsWrap = document.getElementById('carouselDots');
  if (showArrows) {
    dotsWrap.style.display = 'flex';
    dotsWrap.innerHTML = Array.from({ length: totalPages }).map((_, i) =>
      `<span class="carousel-dot${i === currentPage ? ' active' : ''}" onclick="goToPage(${i})"></span>`
    ).join('');
  } else {
    dotsWrap.style.display = 'none';
    dotsWrap.innerHTML = '';
  }
}

function carouselNav(dir) {
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  currentPage = Math.min(Math.max(currentPage + dir, 0), totalPages - 1);
  updateCarouselUI(totalPages);
}

function goToPage(pageIndex) {
  currentPage = pageIndex;
  updateCarouselUI(Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE)));
}

// ── FILTROS ───────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderCarousel();
  });
});

// ── LIGHTBOX ─────────────────────────────────────────────
function openLightbox(index) {
  currentLightboxIndex = index;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderLightbox() {
  const item = filteredItems[currentLightboxIndex];
  const img = document.getElementById('lightboxImg');
  const placeholder = document.getElementById('lightboxPlaceholder');
  const caption = document.getElementById('lightboxCaption');
  const placeholderText = document.getElementById('lightboxPlaceholderText');

  caption.textContent = item.label;

  if (item.src) {
    img.src = item.src;
    img.alt = item.label;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
    placeholderText.textContent = item.label + ' — substituir pela foto real';
  }
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightboxOutside(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

function navigateLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + filteredItems.length) % filteredItems.length;
  renderLightbox();
}

// ── MOBILE MENU ──────────────────────────────────────────
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.nav-hamburger');
  if (!menu || !hamburger) return;
  if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ── TECLADO NO LIGHTBOX ───────────────────────────────────
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') navigateLightbox(1);
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
});

// ── INIT ─────────────────────────────────────────────────
renderCarousel();