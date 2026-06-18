async function loadVideo(shell) {
  if (!shell || shell.dataset.ready === "1") {
    return;
  }

  const video = shell.querySelector("video");
  if (!video) {
    return;
  }

  const source = video.dataset.hls;
  if (!source) {
    return;
  }

  shell.dataset.ready = "1";

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = source;
  } else {
    const module = await import("./hls-vendor-dru42stk.js");
    const Hls = module.H;

    if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      shell._hls = hls;
    } else {
      video.src = source;
    }
  }

  shell.classList.add("is-active");

  try {
    await video.play();
  } catch (error) {
    shell.dataset.ready = "0";
  }
}

document.querySelectorAll("[data-player]").forEach((shell) => {
  const button = shell.querySelector("[data-play-button]");
  const video = shell.querySelector("video");

  if (button) {
    button.addEventListener("click", () => loadVideo(shell));
  }

  if (video) {
    video.addEventListener("click", () => {
      if (shell.dataset.ready !== "1") {
        loadVideo(shell);
      }
    });
  }
});
