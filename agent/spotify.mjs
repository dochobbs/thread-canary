// spotify.mjs — Spotify Web API integration for THREAD
//
// Uses client_credentials flow (no user login needed).
// Provides search, curated playlists, and mood-based recommendations.

const TOKEN_URL="https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

let cachedToken = null;
let tokenExpiresAt = 0;

// Curated fallback playlists if API fails or for quick responses
export const CURATED_PLAYLISTS = {
  study: {
    name: "Lo-Fi Beats",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn",
    description: "lo-fi hip hop for studying"
  },
  focus: {
    name: "Deep Focus",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
    description: "keep calm and focus with ambient and post-rock"
  },
  sleep: {
    name: "Sleep",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp",
    description: "gentle ambient for falling asleep"
  },
  winddown: {
    name: "Evening Chill",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7",
    description: "wind down the day"
  },
  calm: {
    name: "Peaceful Piano",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
    description: "relax with beautiful piano pieces"
  },
  anxiety: {
    name: "Anxiety Relief",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWXe9gFZP0gtP",
    description: "calming sounds for anxious moments"
  },
  energy: {
    name: "Motivation Mix",
    url: "https://open.spotify.com/playlist/37i9dQZF1DXdxcBWuJkbcy",
    description: "get moving"
  },
  sad: {
    name: "Sad Hours",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX7qK8ma5wgG1",
    description: "when you need to sit with it"
  }
};

async function getAccessToken(clientId, clientSecret) {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`Spotify token error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;
  return cachedToken;
}

async function spotifyGet(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Spotify API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// Search for playlists matching a mood/query
export async function searchPlaylists(query, clientId, clientSecret, limit = 3) {
  try {
    const token = await getAccessToken(clientId, clientSecret);
    const encoded = encodeURIComponent(query);
    const data = await spotifyGet(`/search?q=${encoded}&type=playlist&limit=${limit}`, token);

    return data.playlists.items
      .filter(p => p && p.external_urls?.spotify)
      .map(p => ({
        name: p.name,
        url: p.external_urls.spotify,
        description: p.description || "",
        owner: p.owner?.display_name || "",
        tracks: p.tracks?.total || 0,
        image: p.images?.[0]?.url || null,
      }));
  } catch (e) {
    console.error("Spotify search failed:", e.message);
    return null;
  }
}

// Search for tracks
export async function searchTracks(query, clientId, clientSecret, limit = 5) {
  try {
    const token = await getAccessToken(clientId, clientSecret);
    const encoded = encodeURIComponent(query);
    const data = await spotifyGet(`/search?q=${encoded}&type=track&limit=${limit}`, token);

    return data.tracks.items
      .filter(t => t && t.external_urls?.spotify)
      .map(t => ({
        name: t.name,
        artist: t.artists?.map(a => a.name).join(", ") || "",
        url: t.external_urls.spotify,
        album: t.album?.name || "",
        image: t.album?.images?.[0]?.url || null,
      }));
  } catch (e) {
    console.error("Spotify track search failed:", e.message);
    return null;
  }
}

// Get mood-appropriate playlist based on context
export function getMoodPlaylist(mood) {
  const lower = (mood || "").toLowerCase();

  if (/study|focus|homework|exam|midterm|practical|review/.test(lower)) {
    return Math.random() > 0.5 ? CURATED_PLAYLISTS.study : CURATED_PLAYLISTS.focus;
  }
  if (/sleep|bed|tired|insomnia|lights.?out|wind.?down|relax/.test(lower)) {
    return Math.random() > 0.5 ? CURATED_PLAYLISTS.sleep : CURATED_PLAYLISTS.winddown;
  }
  if (/calm|anxious|anxiety|stressed|overwhelm|panic/.test(lower)) {
    return Math.random() > 0.5 ? CURATED_PLAYLISTS.calm : CURATED_PLAYLISTS.anxiety;
  }
  if (/energy|motivat|workout|pump|run/.test(lower)) {
    return CURATED_PLAYLISTS.energy;
  }
  if (/sad|down|lonely|miss|homesick/.test(lower)) {
    return CURATED_PLAYLISTS.sad;
  }

  // Default to study
  return CURATED_PLAYLISTS.focus;
}

// High-level: find the best playlist for a situation
export async function findPlaylist(query, clientId, clientSecret) {
  // Try Spotify search first
  if (clientId && clientSecret) {
    const results = await searchPlaylists(query, clientId, clientSecret, 1);
    if (results && results.length > 0) {
      return results[0];
    }
  }

  // Fall back to curated
  return getMoodPlaylist(query);
}