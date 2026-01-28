exports.handler = async () => {
  const username = "Benxs44";
  const apiKey = "db9963b4676e1bdec97a158e88e8d3de";

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=5`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    const tracks = json.recenttracks.track;

    const nowPlaying = tracks[0];
    const isNowPlaying = nowPlaying["@attr"]?.nowplaying === "true";

    return {
      statusCode: 200,
      body: JSON.stringify({
        playing: isNowPlaying,
        title: nowPlaying.name,
        artist: nowPlaying.artist["#text"],
        albumArt: nowPlaying.image[3]["#text"],
        recent: tracks.map(t => ({
          title: t.name,
          artist: t.artist["#text"],
          art: t.image[2]["#text"]
        }))
      })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load track" })
    };
  }
};
