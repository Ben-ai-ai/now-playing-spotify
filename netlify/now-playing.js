exports.handler = async () => {
  const username = "YOUR_LASTFM_USERNAME";
  const apiKey = "YOUR_LASTFM_API_KEY";

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    const track = json.recenttracks.track[0];

    const isNowPlaying =
      track["@attr"] && track["@attr"].nowplaying === "true";

    return {
      statusCode: 200,
      body: JSON.stringify({
        playing: isNowPlaying,
        title: track.name,
        artist: track.artist["#text"],
        albumArt: track.image[3]["#text"] || track.image[2]["#text"] || "",
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load track" }),
    };
  }
};
