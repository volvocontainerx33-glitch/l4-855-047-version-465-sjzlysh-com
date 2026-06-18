(function () {
  function bindPlayer(box) {
    var video = box.querySelector("video");
    var overlay = box.querySelector("[data-player-overlay]");
    var playButton = box.querySelector("[data-play-button]");
    var stream = box.getAttribute("data-stream");
    var activeHls = null;

    function attachStream() {
      if (!video || !stream || video.getAttribute("data-ready") === "1") {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        activeHls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        activeHls.loadSource(stream);
        activeHls.attachMedia(video);
        video.hlsInstance = activeHls;
      } else {
        video.src = stream;
      }

      video.setAttribute("data-ready", "1");
    }

    function begin() {
      attachStream();

      if (overlay) {
        overlay.classList.add("is-hidden");
      }

      if (video) {
        var playing = video.play();
        if (playing && typeof playing.catch === "function") {
          playing.catch(function () {
            if (overlay) {
              overlay.classList.remove("is-hidden");
            }
          });
        }
      }
    }

    if (overlay) {
      overlay.addEventListener("click", begin);
    }

    if (playButton) {
      playButton.addEventListener("click", function (event) {
        event.stopPropagation();
        begin();
      });
    }

    if (video) {
      video.addEventListener("play", function () {
        if (!video.getAttribute("data-ready")) {
          attachStream();
        }
      });
    }
  }

  document.querySelectorAll("[data-video-player]").forEach(bindPlayer);
})();
