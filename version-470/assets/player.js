(function () {
  window.startMoviePlayer = function (source) {
    var video = document.getElementById("movie-video");
    var cover = document.querySelector(".player-cover");
    var button = document.querySelector(".player-button");
    var initialized = false;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    var attach = function () {
      if (initialized) {
        return;
      }
      initialized = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        video.src = source;
      }
    };

    var play = function () {
      attach();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      video.play().catch(function () {});
    };

    if (cover) {
      cover.addEventListener("click", play);
    }
    if (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        play();
      });
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
