async function loadNowPlaying(username) {
  try {
    const res = await fetch(`/.netlify/functions/now-playing?user=${username}`);
    const data = await res.json();

    const titleEl = document.getElementById('songTitle');
    const artistEl = document.getElementById('artistName');
    const artEl = document.getElementById('albumArt');
    const statusEl = document.getElementById('status');
    const recentList = document.getElementById('recentList');

    if (!data.playing) {
      titleEl.textContent = 'Nothing playing right now';
      artistEl.textContent = '';
      artEl.src = '';
      statusEl.textContent = 'Open your music app and start a track.';
      document.documentElement.style.setProperty('--album-bg', 'none');
      recentList.innerHTML = "";
      return;
    }

    titleEl.textContent = data.title;
    artistEl.textContent = data.artist;
    artEl.src = data.albumArt;
    statusEl.textContent = `▶ Now scrobbling via Last.fm (${username})`;

    document.documentElement.style.setProperty(
      '--album-bg',
      `url(${data.albumArt})`
    );

    recentList.innerHTML = "";
    data.recent.forEach((track, index) => {
      if (index === 0) return;

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

// Load saved username or default
let currentUser = localStorage.getItem('lastfmUser') || "Benxs44";
loadNowPlaying(currentUser);
setInterval(() => loadNowPlaying(currentUser), 15000);

// Handle username change
document.getElementById('loadUserBtn').addEventListener('click', () => {
  const input = document.getElementById('usernameInput').value.trim();
  if (input.length > 0) {
    currentUser = input;
    localStorage.setItem('lastfmUser', input);
    loadNowPlaying(currentUser);
  }
});
