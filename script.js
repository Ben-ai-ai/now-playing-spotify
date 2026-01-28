async function loadNowPlaying() {
  try {
    const res = await fetch('/.netlify/functions/now-playing');
    const data = await res.json();

    const titleEl = document.getElementById('songTitle');
    const artistEl = document.getElementById('artistName');
    const artEl = document.getElementById('albumArt');
    const statusEl = document.getElementById('status');
    const recentList = document.getElementById('recentList');

    // If nothing is playing
    if (!data.playing) {
      titleEl.textContent = 'Nothing playing right now';
      artistEl.textContent = '';
      artEl.src = '';
      statusEl.textContent = 'Open your music app and start a track.';

      document.documentElement.style.setProperty('--album-bg', 'none');
      recentList.innerHTML = "";
      return;
    }

    // Now playing info
    titleEl.textContent = data.title;
    artistEl.textContent = data.artist;
    artEl.src = data.albumArt;
    statusEl.textContent = '▶ Now scrobbling via Last.fm';

    // Update blurred background
    document.documentElement.style.setProperty(
      '--album-bg',
      `url(${data.albumArt})`
    );

    // Recently played list
    recentList.innerHTML = "";

    data.recent.forEach((track, index) => {
      if (index === 0) return; // skip now playing

      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${track.art}">
        <div>
          <strong>${track.title}</strong><br>
          ${track.artist}
        </div>
      `;
      recentList.appendChild(li);
    });

  } catch (e) {
    console.error(e);
    document.getElementById('songTitle').textContent = 'Error loading track';
  }
}

loadNowPlaying();
setInterval(loadNowPlaying, 15000);
