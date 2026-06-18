(function () {
  var configElement = document.getElementById('player-config');
  var video = document.getElementById('movie-player');
  var playButton = document.getElementById('play-button');

  if (!configElement || !video || !playButton) {
    return;
  }

  var config = JSON.parse(configElement.textContent || '{}');
  var started = false;
  var hlsInstance = null;

  function attachStream() {
    if (!config.src) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = config.src;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hlsInstance.loadSource(config.src);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = config.src;
  }

  function startPlayback() {
    if (!started) {
      started = true;
      attachStream();
    }

    playButton.classList.add('is-hidden');

    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        playButton.classList.remove('is-hidden');
      });
    }
  }

  playButton.addEventListener('click', startPlayback);

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener('play', function () {
    playButton.classList.add('is-hidden');
  });

  video.addEventListener('pause', function () {
    if (!video.ended) {
      playButton.classList.remove('is-hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
