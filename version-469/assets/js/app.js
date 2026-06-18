(function () {
  var onReady = function (callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  };

  var bindMenu = function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  };

  var bindCarousel = function () {
    var carousel = document.querySelector('[data-carousel]');
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-slide-dot]'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var activate = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('is-active', position === index);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle('is-active', position === index);
      });
    };
    dots.forEach(function (dot, position) {
      dot.addEventListener('click', function () {
        activate(position);
      });
    });
    window.setInterval(function () {
      activate(index + 1);
    }, 5600);
  };

  var bindFilters = function () {
    var input = document.querySelector('[data-card-search]');
    var select = document.querySelector('[data-card-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    if (!cards.length || (!input && !select)) {
      return;
    }
    var apply = function () {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var filter = select ? select.value : '';
      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var category = card.getAttribute('data-category') || '';
        var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
        var filterMatch = !filter || category === filter;
        card.classList.toggle('is-filtered-out', !(keywordMatch && filterMatch));
      });
    };
    if (input) {
      input.addEventListener('input', apply);
    }
    if (select) {
      select.addEventListener('change', apply);
    }
    apply();
  };

  var bindPlayers = function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (player) {
      var video = player.querySelector('video');
      var overlay = player.querySelector('[data-player-overlay]');
      var url = player.getAttribute('data-player-url');
      var ready = false;
      var hlsInstance = null;
      if (!video || !url) {
        return;
      }
      var attach = function () {
        if (ready) {
          return;
        }
        ready = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            maxBufferLength: 30,
            enableWorker: true
          });
          hlsInstance.loadSource(url);
          hlsInstance.attachMedia(video);
        } else {
          video.src = url;
        }
      };
      var play = function () {
        attach();
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {});
        }
      };
      if (overlay) {
        overlay.addEventListener('click', play);
      }
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
      video.addEventListener('ended', function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
      window.addEventListener('pagehide', function () {
        if (hlsInstance && typeof hlsInstance.destroy === 'function') {
          hlsInstance.destroy();
        }
      });
    });
  };

  onReady(function () {
    bindMenu();
    bindCarousel();
    bindFilters();
    bindPlayers();
  });
})();
