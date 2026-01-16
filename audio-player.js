document.querySelectorAll('.audio-player').forEach(player => {
  const audio = player.querySelector('audio');
  const playBtn = player.querySelector('.play-btn');
  const slider = player.querySelector('.progress');
  const wave = player.querySelector('.wave-progress');
  const current = player.querySelector('.current');
  const duration = player.querySelector('.duration');

  let rafId;

  playBtn.addEventListener('click', () => {
    if (!audio.paused) {
      audio.pause();
      playBtn.textContent = '▶';
      cancelAnimationFrame(rafId);
      return;
    }

    document.querySelectorAll('audio').forEach(a => {
      if (a !== audio) a.pause();
    });
    document.querySelectorAll('.play-btn').forEach(b => b.textContent = '▶');

    audio.play();
    playBtn.textContent = '⏸';
    update();
  });

  audio.addEventListener('loadedmetadata', () => {
    slider.max = Math.floor(audio.duration);
    duration.textContent = format(audio.duration);
  });

  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    cancelAnimationFrame(rafId);
  });

  slider.addEventListener('input', () => {
    audio.currentTime = slider.value;
    syncUI();
  });

  function update() {
    syncUI();
    if (!audio.paused) {
      rafId = requestAnimationFrame(update);
    }
  }

  function syncUI() {
    const percent = (audio.currentTime / audio.duration) * 100;
    slider.value = audio.currentTime;
    wave.style.width = percent + '%';
    current.textContent = format(audio.currentTime);
  }

  function format(time) {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
});
