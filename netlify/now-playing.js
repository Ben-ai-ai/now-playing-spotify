const fetch = require('node-fetch');

exports.handler = async () => {
  try {
    const token = await getAccessToken();

    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 204 || res.status === 202) {
      return {
        statusCode: 200,
        body: JSON.stringify({ playing: false })
      };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        playing: data.is_playing,
        title: data.item.name,
        artist: data.item.artists.map(a => a.name).join(', '),
        albumArt: data.item.album.images[0].url
      })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};

async function getAccessToken() {
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;

  const auth = Buffer.from(`${id}:${secret}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refresh)}`
  });

  const json = await res.json();
  return json.access_token;
}
