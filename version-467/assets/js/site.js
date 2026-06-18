(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var searchInput = document.querySelector('[data-page-search]');
  var searchGrid = document.querySelector('[data-search-grid]');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
  var activeFilter = 'all';

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyQueryFromUrl() {
    if (!searchInput) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');

    if (query) {
      searchInput.value = query;
    }
  }

  function filterCards() {
    if (!searchInput || !searchGrid) {
      return;
    }

    var query = normalize(searchInput.value);
    var cards = Array.prototype.slice.call(searchGrid.querySelectorAll('.movie-card'));

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search-text'));
      var title = normalize(card.getAttribute('data-title'));
      var category = card.getAttribute('data-category') || '';
      var queryMatch = !query || text.indexOf(query) !== -1 || title.indexOf(query) !== -1;
      var filterMatch = activeFilter === 'all' || category === activeFilter;
      card.hidden = !(queryMatch && filterMatch);
    });
  }

  if (searchInput && searchGrid) {
    applyQueryFromUrl();
    searchInput.addEventListener('input', filterCards);
    filterCards();
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = button.getAttribute('data-filter-value') || 'all';
      filterButtons.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      filterCards();
    });
  });
})();
