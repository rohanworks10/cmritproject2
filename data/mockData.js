export const artists = [
  {
    id: "artist-1",
    name: "Luna Nova",
    bio: "Luna Nova blends ambient electronics with dream-pop vocals, building hazy soundscapes for late-night listening. Their debut EP put them on festival lineups across Europe within a year.",
    verified: true,
    genre: "Electronic",
    image: "https://picsum.photos/seed/luna-nova/400/400",
  },
  {
    id: "artist-2",
    name: "Neon Pulse",
    bio: "Neon Pulse channels 80s synthwave into modern club tracks—neon-soaked leads, punchy drums, and hooks built for the dance floor. Film and game syncs helped define their retro-futurist brand.",
    verified: true,
    genre: "Synthwave",
    image: "https://picsum.photos/seed/neon-pulse/400/400",
  },
  {
    id: "artist-3",
    name: "Coastal Echoes",
    bio: "Coastal Echoes writes intimate folk and indie songs inspired by shorelines and open roads. Acoustic guitar, close-mic vocals, and subtle field recordings anchor their warm, unhurried records.",
    verified: false,
    genre: "Indie Folk",
    image: "https://picsum.photos/seed/coastal-echoes/400/400",
  },
  {
    id: "artist-4",
    name: "Metro Beats",
    bio: "Metro Beats fuses hip-hop, R&B, and UK garage into city-ready anthems. Known for crisp production and guest features, they’ve become a staple on urban playlists worldwide.",
    verified: true,
    genre: "Hip-Hop",
    image: "https://picsum.photos/seed/metro-beats/400/400",
  },
];

const DEFAULT_AUDIO_URL =
  "https://res.cloudinary.com/dxxvf29gt/video/upload/v1779004696/mfcc-demo-music-upbeat-exciting-vlog-background-intro-theme-328256_o0utpy.mp3";

export const songs = [
  {
    id: "song-1",
    title: "Midnight Dreams",
    artist: "Luna Nova",
    artistId: "artist-1",
    album: "Ethereal Nights",
    cover: "https://picsum.photos/seed/midnight-dreams/300/300",
    duration: "3:42",
    likes: 12840,
    audioUrl:
      "https://res.cloudinary.com/dxxvf29gt/video/upload/v1779004696/mfcc-demo-music-upbeat-exciting-vlog-background-intro-theme-328256_o0utpy.mp3",
  },
  {
    id: "song-2",
    title: "Starlight Serenade",
    artist: "Luna Nova",
    artistId: "artist-1",
    album: "Ethereal Nights",
    cover: "https://picsum.photos/seed/starlight-serenade/300/300",
    duration: "4:08",
    likes: 9620,
    audioUrl:
      "https://res.cloudinary.com/dxxvf29gt/video/upload/v1779004687/momotmusic-a-product-demo-167264_v3ouub.mp3",
  },
  {
    id: "song-3",
    title: "Electric Soul",
    artist: "Neon Pulse",
    artistId: "artist-2",
    album: "Digital Age",
    cover: "https://picsum.photos/seed/electric-soul/300/300",
    duration: "4:15",
    likes: 18450,
    audioUrl:
      "https://res.cloudinary.com/dxxvf29gt/video/upload/v1779004673/momotmusic-business-168341_1_vxsbeo.mp3",
  },
  {
    id: "song-4",
    title: "Neon Lights",
    artist: "Neon Pulse",
    artistId: "artist-2",
    album: "Retro Future",
    cover: "https://picsum.photos/seed/neon-lights/300/300",
    duration: "3:35",
    likes: 11230,
    audioUrl:
      "https://res.cloudinary.com/dxxvf29gt/video/upload/v1779004662/momotmusic-corporate-inspiring-222800_wi1sk4.mp3",
  },
  {
    id: "song-5",
    title: "Ocean Waves",
    artist: "Coastal Echoes",
    artistId: "artist-3",
    album: "Seaside Stories",
    cover: "https://picsum.photos/seed/ocean-waves/300/300",
    duration: "3:58",
    likes: 5870,
    audioUrl: DEFAULT_AUDIO_URL,
  },
  {
    id: "song-6",
    title: "Urban Jungle",
    artist: "Metro Beats",
    artistId: "artist-4",
    album: "City Lights",
    cover: "https://picsum.photos/seed/urban-jungle/300/300",
    duration: "3:22",
    likes: 22100,
    audioUrl: DEFAULT_AUDIO_URL,
  },
];

export const interviews = [
  {
    id: "interview-1",
    artistId: "artist-1",
    title: "Luna Nova on building worlds in sound",
    date: "2025-11-12",
    content: [
      "We spoke with Luna Nova days after the release of Ethereal Nights, an album they describe as “a room you can walk into.” They walked us through layering soft synth pads under whispered vocals, and why restraint matters more than volume in their mixes.",
      "On inspiration, Luna credits long train rides and old sci-fi soundtracks. They demo on a modest setup—laptop, one controller, a borrowed microphone—and finish arrangements only when a track feels emotionally complete, not when the grid looks full.",
      "Looking ahead, Luna is experimenting with live visuals and wants to tour smaller venues where the audience can hear every detail. “I’d rather play to fifty people who are listening,” they said, “than five hundred who are scrolling.”",
    ],
  },
  {
    id: "interview-2",
    artistId: "artist-2",
    title: "Neon Pulse and the return of retro futurism",
    date: "2025-10-28",
    content: [
      "Neon Pulse has ridden the synthwave wave without standing still. In this interview, they explain how Digital Age pushes brighter leads and tighter low end than their earlier work, while still nodding to VHS-era nostalgia.",
      "Collaboration is central: guest vocalists, remix swaps, and co-writing sessions over video calls shaped half the album. Neon says the hardest part is knowing when a chorus is “sticky enough” without becoming repetitive.",
      "They’re candid about burnout after a packed festival season and are taking time to produce for other artists before their next headline run. Fans can expect a surprise EP of instrumentals before the full follow-up LP.",
    ],
  },
  {
    id: "interview-3",
    artistId: "artist-4",
    title: "Metro Beats: rhythm, roots, and the city",
    date: "2025-09-05",
    content: [
      "Metro Beats grew up on pirate radio and block parties; City Lights is their love letter to that energy translated for streaming playlists. They break down sampling ethics, tempo choices, and why the snare always sits slightly late.",
      "The conversation turns to representation: Metro mentors young producers in their borough and funds studio time for artists who can’t afford hourly rates. “Success isn’t just chart position,” they argue, “it’s who gets to make the next record.”",
      "They close with a tease of a collaborative mixtape featuring MCs from three continents, recorded mostly over voice notes and stitched together in a single frantic week. “Chaos,” Metro laughs, “but the good kind.”",
    ],
  },
];

export function getSongById(id) {
  return songs.find((song) => song.id === id);
}

export function getArtistById(id) {
  return artists.find((artist) => artist.id === id);
}

export function getSongsByArtistId(artistId) {
  return songs.filter((song) => song.artistId === artistId);
}

export function getInterviewsByArtistId(artistId) {
  return interviews.filter((interview) => interview.artistId === artistId);
}

export function getInterviewById(id) {
  return interviews.find((interview) => interview.id === id);
}

export function formatLikes(count) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}
