const menuButton = document.querySelector("[data-menu-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");

if (menuButton && mobilePanel) {
  menuButton.addEventListener("click", () => {
    mobilePanel.classList.toggle("is-open");
  });
}

const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
let heroIndex = 0;

function showHero(index) {
  if (!slides.length) {
    return;
  }

  heroIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, current) => {
    slide.classList.toggle("is-active", current === heroIndex);
  });

  dots.forEach((dot, current) => {
    dot.classList.toggle("is-active", current === heroIndex);
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => showHero(index));
});

if (slides.length > 1) {
  window.setInterval(() => showHero(heroIndex + 1), 6200);
}

const searchInput = document.querySelector("[data-search-input]");
const yearSelect = document.querySelector("[data-year-filter]");
const typeSelect = document.querySelector("[data-type-filter]");
const movieCards = Array.from(document.querySelectorAll("[data-movie-card]"));
const emptyState = document.querySelector("[data-empty-state]");

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function applyFilters() {
  if (!movieCards.length) {
    return;
  }

  const query = normalize(searchInput ? searchInput.value : "");
  const year = yearSelect ? yearSelect.value : "";
  const type = typeSelect ? typeSelect.value : "";
  let visible = 0;

  movieCards.forEach((card) => {
    const title = normalize(card.dataset.title);
    const region = normalize(card.dataset.region);
    const genre = normalize(card.dataset.genre);
    const tags = normalize(card.dataset.tags);
    const line = normalize(card.dataset.line);
    const cardYear = card.dataset.year || "";
    const cardType = card.dataset.type || "";
    const queryMatch = !query || [title, region, genre, tags, line].some((value) => value.includes(query));
    const yearMatch = !year || cardYear === year;
    const typeMatch = !type || cardType === type;
    const show = queryMatch && yearMatch && typeMatch;

    card.style.display = show ? "" : "none";

    if (show) {
      visible += 1;
    }
  });

  if (emptyState) {
    emptyState.style.display = visible ? "none" : "block";
  }
}

[searchInput, yearSelect, typeSelect].forEach((node) => {
  if (node) {
    node.addEventListener("input", applyFilters);
    node.addEventListener("change", applyFilters);
  }
});
