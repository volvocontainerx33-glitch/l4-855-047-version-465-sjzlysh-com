(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterType = document.querySelector('[data-filter-type]');
  var filterYear = document.querySelector('[data-filter-year]');
  var filterCards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));

  function applyCardFilter() {
    var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var type = filterType ? filterType.value : '';
    var year = filterYear ? filterYear.value : '';

    filterCards.forEach(function (card) {
      var text = [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre')
      ].join(' ').toLowerCase();

      var typeMatched = !type || card.getAttribute('data-type') === type;
      var yearMatched = !year || card.getAttribute('data-year') === year;
      var queryMatched = !query || text.indexOf(query) !== -1;

      card.style.display = typeMatched && yearMatched && queryMatched ? '' : 'none';
    });
  }

  [filterInput, filterType, filterYear].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyCardFilter);
      control.addEventListener('change', applyCardFilter);
    }
  });

  var searchRoot = document.querySelector('[data-search-results]');
  var searchInput = document.querySelector('[data-search-input]');
  var searchCategory = document.querySelector('[data-search-category]');
  var searchType = document.querySelector('[data-search-type]');
  var searchYear = document.querySelector('[data-search-year]');
  var searchStatus = document.querySelector('[data-search-status]');

  function cardMarkup(movie) {
    var tags = movie.tags.slice(0, 5).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '' +
      '<article class="movie-card">' +
        '<a class="poster-link" href="movie/' + movie.file + '" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
          '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
          '<span class="poster-shade"></span>' +
          '<span class="year-pill">' + escapeHtml(movie.year) + '</span>' +
        '</a>' +
        '<div class="movie-card-body">' +
          '<a class="movie-title" href="movie/' + movie.file + '">' + escapeHtml(movie.title) + '</a>' +
          '<div class="movie-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
          '<p>' + escapeHtml(movie.oneLine) + '</p>' +
          '<div class="tag-row">' + tags + '</div>' +
        '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderSearch() {
    if (!searchRoot || !window.SEARCH_MOVIES) {
      return;
    }

    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var category = searchCategory ? searchCategory.value : '';
    var type = searchType ? searchType.value : '';
    var year = searchYear ? searchYear.value : '';

    var results = window.SEARCH_MOVIES.filter(function (movie) {
      var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags.join(' ')].join(' ').toLowerCase();
      return (!query || haystack.indexOf(query) !== -1) &&
        (!category || movie.categorySlug === category) &&
        (!type || movie.type === type) &&
        (!year || movie.year === year);
    });

    searchRoot.innerHTML = results.slice(0, 120).map(cardMarkup).join('');

    if (searchStatus) {
      searchStatus.textContent = results.length ? '匹配影片：' + results.length + '，当前展示：' + Math.min(results.length, 120) : '没有匹配的影片';
    }
  }

  [searchInput, searchCategory, searchType, searchYear].forEach(function (control) {
    if (control) {
      control.addEventListener('input', renderSearch);
      control.addEventListener('change', renderSearch);
    }
  });

  renderSearch();
})();
