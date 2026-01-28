async function loadNowPlaying() {
  try {
    const res = await fetch('/.netlify/functions/now-playing');
    const data = await res.json();

    const titleEl = document.getElementById('songTitle');
    const artistEl = document.getElementById('artistName');
    const artEl = document.getElementById('albumArt');
    const statusEl = document.getElementById('status');

    if (!data.playing) {
      titleEl.textContent = 'Nothing playing right now';
      artistEl.textContent = '';
      artEl.src = '';
      statusEl.textContent = 'Open Spotify and start a track.';
      return;
    }

    titleEl.textContent = data.title;
    artistEl.textContent = data.artist;
    artEl.src = data.albumArt;
    statusEl.textContent = data.playing ? '▶ Playing on Spotify' : '⏸ Paused';
  } catch (e) {
    console.error(e);
    document.getElementById('songTitle').textContent = 'Error loading track';
  }
}

loadNowPlaying();
setInterval(loadNowPlaying, 15000);
