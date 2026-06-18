(function () {
    document.querySelectorAll('[data-player]').forEach(function (box) {
        var video = box.querySelector('video');
        var cover = box.querySelector('.player-cover');
        var trigger = box.querySelector('[data-play-button]');
        if (!video) {
            return;
        }
        var src = video.getAttribute('data-video');
        var started = false;
        var hls = null;
        function start() {
            if (!src) {
                return;
            }
            if (cover) {
                cover.classList.add('is-hidden');
            }
            video.controls = true;
            if (!started) {
                started = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = src;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                    hls.loadSource(src);
                    hls.attachMedia(video);
                } else {
                    video.src = src;
                }
            }
            var playPromise = video.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(function () {});
            }
        }
        if (trigger) {
            trigger.addEventListener('click', start);
        }
        if (cover) {
            cover.addEventListener('click', start);
        }
        video.addEventListener('click', function () {
            if (!started) {
                start();
            }
        });
        window.addEventListener('pagehide', function () {
            if (hls && hls.destroy) {
                hls.destroy();
            }
        });
    });
}());
