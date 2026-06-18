(function () {
  var currentScript = document.currentScript;
  var scriptUrl = currentScript ? currentScript.src : "";
  var scriptBase = scriptUrl ? scriptUrl.slice(0, scriptUrl.lastIndexOf("/") + 1) : "assets/js/";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero-slider]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        schedule();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        schedule();
      });
    }

    show(0);
    schedule();
  }

  function textOf(card) {
    return [
      card.getAttribute("data-title") || "",
      card.getAttribute("data-category") || "",
      card.getAttribute("data-region") || "",
      card.getAttribute("data-type") || "",
      card.getAttribute("data-year") || "",
      card.getAttribute("data-genre") || "",
      card.getAttribute("data-tags") || ""
    ].join(" ").toLowerCase();
  }

  function setupFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-search-scope]"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-search-input]");
      var reset = scope.querySelector("[data-filter-reset]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-search-item]"));
      var chips = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-chip]"));
      var empty = scope.querySelector("[data-empty-state]");
      var state = {
        category: "全部",
        year: "全部"
      };

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = textOf(card);
          var okQuery = !query || haystack.indexOf(query) !== -1;
          var okCategory = state.category === "全部" || (card.getAttribute("data-category") || "") === state.category;
          var okYear = state.year === "全部" || (card.getAttribute("data-year") || "") === state.year;
          var show = okQuery && okCategory && okYear;
          card.classList.toggle("is-hidden", !show);
          if (show) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("visible", visible === 0);
        }
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          var group = chip.getAttribute("data-filter-chip");
          var value = chip.getAttribute("data-filter-value") || "全部";
          state[group] = value;
          chips.filter(function (item) {
            return item.getAttribute("data-filter-chip") === group;
          }).forEach(function (item) {
            item.classList.toggle("active", item === chip);
          });
          apply();
        });
      });

      if (input) {
        input.addEventListener("input", apply);
      }

      if (reset) {
        reset.addEventListener("click", function () {
          if (input) {
            input.value = "";
          }
          state.category = "全部";
          state.year = "全部";
          chips.forEach(function (chip) {
            chip.classList.toggle("active", (chip.getAttribute("data-filter-value") || "全部") === "全部");
          });
          apply();
        });
      }
    });
  }

  function loadLocalHls() {
    return import(scriptBase + "hls.js").then(function (mod) {
      return mod.H;
    });
  }

  function setupPlayer() {
    var wrap = document.querySelector("[data-player]");
    if (!wrap) {
      return;
    }
    var video = wrap.querySelector("video");
    var button = wrap.querySelector(".play-overlay");
    var message = wrap.querySelector("[data-player-message]");
    var url = wrap.getAttribute("data-video") || "";
    var initialized = false;
    var hlsInstance = null;

    function showMessage(text) {
      if (!message) {
        return;
      }
      message.textContent = text;
      message.classList.add("visible");
    }

    function bindWithHls(HlsClass) {
      if (!HlsClass || !HlsClass.isSupported()) {
        return false;
      }
      if (hlsInstance) {
        hlsInstance.destroy();
      }
      hlsInstance = new HlsClass({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(video);
      return true;
    }

    function prepare() {
      if (initialized) {
        return Promise.resolve();
      }
      initialized = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        return Promise.resolve();
      }
      if (window.Hls && window.Hls.isSupported()) {
        bindWithHls(window.Hls);
        return Promise.resolve();
      }
      return loadLocalHls().then(function (HlsClass) {
        if (!bindWithHls(HlsClass)) {
          video.src = url;
        }
      }).catch(function () {
        video.src = url;
      });
    }

    function start() {
      if (!url || !video) {
        showMessage("视频加载失败，请稍后重试");
        return;
      }
      prepare().then(function () {
        wrap.classList.add("is-playing");
        var playResult = video.play();
        if (playResult && typeof playResult.catch === "function") {
          playResult.catch(function () {
            showMessage("点击视频控件继续播放");
          });
        }
      }).catch(function () {
        showMessage("视频加载失败，请稍后重试");
      });
    }

    if (button) {
      button.addEventListener("click", start);
    }
    video.addEventListener("error", function () {
      showMessage("视频加载失败，请稍后重试");
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupPlayer();
  });
})();
