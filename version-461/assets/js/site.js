(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }
        if (slides.length) {
            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function () {
                    show(i);
                });
            });
            if (prev) {
                prev.addEventListener('click', function () {
                    show(index - 1);
                });
            }
            if (next) {
                next.addEventListener('click', function () {
                    show(index + 1);
                });
            }
            setInterval(function () {
                show(index + 1);
            }, 5200);
        }
    });

    document.querySelectorAll('.filter-panel').forEach(function (panel) {
        var input = panel.querySelector('[data-filter-search]');
        var year = panel.querySelector('[data-year-filter]');
        var type = panel.querySelector('[data-type-filter]');
        var list = panel.parentElement.querySelector('[data-movie-list]');
        if (!list) {
            return;
        }
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
        var params = new URLSearchParams(window.location.search);
        if (input && params.get('q')) {
            input.value = params.get('q');
        }
        function run() {
            var q = input ? input.value.trim().toLowerCase() : '';
            var y = year ? year.value : '';
            var t = type ? type.value : '';
            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-search') || '').toLowerCase();
                var okText = !q || haystack.indexOf(q) !== -1;
                var okYear = !y || card.getAttribute('data-year') === y;
                var okType = !t || (card.getAttribute('data-type') || '').indexOf(t) !== -1;
                card.style.display = okText && okYear && okType ? '' : 'none';
            });
        }
        [input, year, type].forEach(function (el) {
            if (el) {
                el.addEventListener('input', run);
                el.addEventListener('change', run);
            }
        });
        run();
    });

    document.querySelectorAll('[data-site-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input');
            var q = input ? input.value.trim() : '';
            if (q) {
                window.location.href = './category-hot.html?q=' + encodeURIComponent(q);
            }
        });
    });
}());
