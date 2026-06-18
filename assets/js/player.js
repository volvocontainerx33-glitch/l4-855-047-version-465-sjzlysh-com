(function () {
    function setupPlayer(options) {
        var video = document.querySelector(options.videoSelector);
        var button = document.querySelector(options.buttonSelector);
        var layer = document.querySelector(options.layerSelector);
        var source = options.source;
        var loaded = false;
        var hls = null;

        if (!video || !source) {
            return;
        }

        function loadSource() {
            if (loaded) {
                return;
            }

            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                return;
            }

            video.src = source;
        }

        function beginPlay() {
            loadSource();

            if (layer) {
                layer.classList.add('is-hidden');
            }

            var action = video.play();

            if (action && typeof action.catch === 'function') {
                action.catch(function () {
                    if (layer) {
                        layer.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (layer) {
            layer.addEventListener('click', beginPlay);
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                beginPlay();
            });
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                beginPlay();
            }
        });

        video.addEventListener('play', function () {
            if (layer) {
                layer.classList.add('is-hidden');
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    window.setupPlayer = setupPlayer;
})();
