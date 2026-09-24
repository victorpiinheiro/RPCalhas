/* ═══════════════════════════════════════════════════════════
   RP CALHAS — main.js
   ═══════════════════════════════════════════════════════════ */

// ── DADOS DA GALERIA ─────────────────────────────────────
// Cada item é uma OBRA (um cartão na grade). Fotos da mesma obra ficam juntas em `photos`
// e abrem no lightbox como um mini-álbum.
//   Obra com várias fotos → { title, category, photos: [{ src, label }, ...] }
//   Foto avulsa           → single('assets/foto.jpeg', 'Legenda', 'calhas')
// Obra mista (ex.: rufos + calhas): cada foto leva a sua `category`, e `titles` dá o título do
// cartão em cada filtro. Com um filtro ativo, o cartão mostra só as fotos daquela categoria
// (selo e lightbox incluídos); em "Todos" mostra todas. A primeira foto exibida é a capa.
// O carrossel se reorganiza em páginas de 6 (3 colunas × 2 linhas).
const single = (src, label, category) => ({ title: label, category, photos: [{ src, label }] });

const galleryData = [
  {
    title: 'Cobertura retrátil de vidro — Área gourmet',
    category: 'retratil',
    photos: [
      { src: 'assets/retratil-churrasqueira-03.jpeg', label: 'Vista superior — Cobertura retrátil de vidro sobre área gourmet' },
      { src: 'assets/retratil-churrasqueira-01.jpeg', label: 'Cobertura retrátil de vidro — Vista interna' },
      { src: 'assets/retratil-churrasqueira-02.jpeg', label: 'Cobertura retrátil de vidro com estrutura branca — Área gourmet' },
      { src: 'assets/retratil-churrasqueira-04.jpeg', label: 'Cobertura retrátil de vidro laminado — Residencial' },
      { src: 'assets/retratil-churrasqueira-05.jpeg', label: 'Cobertura retrátil aberta — Motor de acionamento e coifa da churrasqueira' },
    ],
  },
  {
    title: 'Calha e condutor pluvial em aço galvanizado — Residencial',
    category: 'calhas',
    photos: [
      { src: 'assets/calha-3.jpeg', label: 'Calha sob medida em aço galvanizado' },
      { src: 'assets/condutor-1.jpeg', label: 'Condutor pluvial em aço galvanizado' },
    ],
  },
  {
    title: 'Telhado metálico com rufos e calha — Garagem',
    titles: { rufos: 'Rufos em aço galvanizado — Garagem', calhas: 'Calha e condutor em aço galvanizado — Garagem' },
    photos: [
      { src: 'assets/rufo-garagem-02.jpeg', category: 'calhas', label: 'Telhado metálico com calha em aço galvanizado — Garagem' },
      { src: 'assets/rufo-garagem-01.jpeg', category: 'calhas', label: 'Calha em aço galvanizado — Vista inferior do telhado' },
      { src: 'assets/rufo-garagem-03.jpeg', category: 'rufos', label: 'Rufo lateral em aço galvanizado — Telhado metálico' },
      { src: 'assets/calha-garagem-01.jpeg', category: 'calhas', label: 'Calha em aço galvanizado — Telhado metálico' },
      { src: 'assets/condutor-garagem-01.jpeg', category: 'calhas', label: 'Calha e condutor pluvial em aço galvanizado — Detalhe' },
    ],
  },
  {
    title: 'Rufos de muro em aço galvanizado',
    category: 'rufos',
    photos: [
      { src: 'assets/rufo-muro-03.jpeg', label: 'Rufo de muro em aço galvanizado — Vista geral' },
      { src: 'assets/rufo-muro-05.jpeg', label: 'Rufo de muro em aço galvanizado — Residencial' },
      { src: 'assets/rufo-muro-01.jpeg', label: 'Rufo de muro em aço galvanizado — Acabamento de canto' },
      { src: 'assets/rufo-muro-04.jpeg', label: 'Rufo de muro em aço galvanizado — Canteiro' },
      { src: 'assets/rufo-muro-02.jpeg', label: 'Rufo de muro em aço galvanizado — Detalhe do acabamento' },
    ],
  },
  {
    title: 'Telhado retrátil com vidro laminado — Área de lazer',
    category: 'retratil',
    photos: [
      { src: 'assets/telhado-vidro-retratil.jpeg', label: 'Telhado retrátil para área de lazer' },
      { src: 'assets/retratil.jpeg', label: 'Vista superior — Telhado retrátil com vidro laminado' },
    ],
  },
  single('assets/imp.jpeg', 'Impermeabilização de laje residencial', 'impermeabilizacao'),
  single('assets/calha-2.jpeg', 'Calha em aço galvanizado pintado — Residencial', 'calhas'),
  single('assets/rufo-2.jpeg', 'Rufo em aço galvanizado pintado — Residencial', 'rufos'),
  single('assets/calhas-1.jpeg', 'Calha em aço galvanizado pintado — Residencial', 'calhas'),
  single('assets/rufo-1.jpeg', 'Rufo em aço galvanizado', 'rufos'),
];

// ── ESTADO DO CARROSSEL ───────────────────────────────────
const PAGE_SIZE = 6; // 3 colunas × 2 linhas
let currentFilter = 'all';
let filteredItems = [];
let currentPage = 0;
let currentPhotos = [];      // fotos da obra aberta no lightbox
let currentLightboxIndex = 0; // índice dentro de currentPhotos

// ── FILTRAGEM ──────────────────────────────────────────────
// Devolve os cartões a exibir; com filtro ativo, cada cartão só traz as fotos da categoria escolhida.
function getFilteredItems() {
  if (currentFilter === 'all') return galleryData;

  return galleryData
    .map(item => ({
      title: (item.titles && item.titles[currentFilter]) || item.title,
      photos: item.photos.filter(photo => (photo.category || item.category) === currentFilter),
    }))
    .filter(item => item.photos.length > 0);
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
      const count = item.photos.length;
      const badge = count > 1 ? `<span class="gallery-badge">${count} fotos</span>` : '';
      return `
        <div class="gallery-item" onclick="openLightbox(${flatIndex})">
          <img src="${item.photos[0].src}" alt="${item.title}" loading="lazy">
          ${badge}
          <div class="gallery-overlay">
            <div class="gallery-label">${item.title}</div>
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
// Abre o álbum da obra clicada; as setas navegam só entre as fotos dessa obra.
function openLightbox(itemIndex) {
  currentPhotos = filteredItems[itemIndex].photos;
  currentLightboxIndex = 0;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderLightbox() {
  const photo = currentPhotos[currentLightboxIndex];
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');

  document.getElementById('lightbox').classList.toggle('single', currentPhotos.length < 2);
  document.getElementById('lightboxCaption').textContent = photo.label;
  counter.textContent = currentPhotos.length > 1
    ? `${currentLightboxIndex + 1} / ${currentPhotos.length}`
    : '';

  img.src = photo.src;
  img.alt = photo.label;
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightboxOutside(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

function navigateLightbox(dir) {
  if (currentPhotos.length < 2) return;
  currentLightboxIndex = (currentLightboxIndex + dir + currentPhotos.length) % currentPhotos.length;
  renderLightbox();
}

// Deslizar o dedo troca de foto no celular (as setas ficam sobre a imagem)
let touchStartX = 0;
const lightboxInner = document.querySelector('.lightbox-inner');
lightboxInner.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
lightboxInner.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) navigateLightbox(dx < 0 ? 1 : -1);
}, { passive: true });

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