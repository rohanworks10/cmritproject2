export interface Song {
  id: string
  title: string
  artist: string
  artistId: string
  album: string
  duration: string
  coverUrl: string
  plays: number
}

export interface Artist {
  id: string
  name: string
  imageUrl: string
  monthlyListeners: number
  genres: string[]
  bio: string
  songs: Song[]
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
  likes: number
}

export const trendingSongs: Song[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Nova',
    artistId: 'artist-1',
    album: 'Ethereal Nights',
    duration: '3:42',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    plays: 15420000,
  },
  {
    id: '2',
    title: 'Electric Soul',
    artist: 'Neon Pulse',
    artistId: 'artist-2',
    album: 'Digital Age',
    duration: '4:15',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    plays: 12300000,
  },
  {
    id: '3',
    title: 'Ocean Waves',
    artist: 'Coastal Echoes',
    artistId: 'artist-3',
    album: 'Seaside Stories',
    duration: '3:58',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    plays: 9800000,
  },
  {
    id: '4',
    title: 'Urban Jungle',
    artist: 'Metro Beats',
    artistId: 'artist-4',
    album: 'City Lights',
    duration: '3:22',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    plays: 8500000,
  },
  {
    id: '5',
    title: 'Starlight Serenade',
    artist: 'Cosmic Dawn',
    artistId: 'artist-5',
    album: 'Galactic Journey',
    duration: '4:30',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    plays: 7200000,
  },
  {
    id: '6',
    title: 'Velvet Sunrise',
    artist: 'Aurora Skies',
    artistId: 'artist-6',
    album: 'Dawn Horizons',
    duration: '3:55',
    coverUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop',
    plays: 6100000,
  },
  {
    id: '7',
    title: 'Rhythm & Flow',
    artist: 'Bass Culture',
    artistId: 'artist-7',
    album: 'Underground Sessions',
    duration: '4:08',
    coverUrl: 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=300&h=300&fit=crop',
    plays: 5400000,
  },
  {
    id: '8',
    title: 'Neon Lights',
    artist: 'Synth Wave',
    artistId: 'artist-8',
    album: 'Retro Future',
    duration: '3:35',
    coverUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=300&h=300&fit=crop',
    plays: 4800000,
  },
]

export const newReleases: Song[] = [
  {
    id: '9',
    title: 'Breaking Free',
    artist: 'Phoenix Rising',
    artistId: 'artist-9',
    album: 'New Beginnings',
    duration: '3:48',
    coverUrl: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=300&h=300&fit=crop',
    plays: 980000,
  },
  {
    id: '10',
    title: 'Summer Nights',
    artist: 'Tropical Vibes',
    artistId: 'artist-10',
    album: 'Island Dreams',
    duration: '4:02',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop',
    plays: 750000,
  },
  {
    id: '11',
    title: 'Lost in Time',
    artist: 'Temporal Shift',
    artistId: 'artist-11',
    album: 'Chronos',
    duration: '5:12',
    coverUrl: 'https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=300&h=300&fit=crop',
    plays: 620000,
  },
  {
    id: '12',
    title: 'Crystal Clear',
    artist: 'Diamond Sound',
    artistId: 'artist-12',
    album: 'Precious Tones',
    duration: '3:28',
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop',
    plays: 540000,
  },
]

export const artists: Artist[] = [
  {
    id: 'artist-1',
    name: 'Luna Nova',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    monthlyListeners: 8500000,
    genres: ['Electronic', 'Ambient', 'Dream Pop'],
    bio: 'Luna Nova is an electronic music producer and vocalist known for creating ethereal soundscapes that blend ambient textures with dreamy pop melodies. With influences ranging from classic electronic pioneers to modern indie artists, Luna has carved out a unique sonic identity.',
    songs: trendingSongs.slice(0, 4),
  },
  {
    id: 'artist-2',
    name: 'Neon Pulse',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    monthlyListeners: 6200000,
    genres: ['Synthwave', 'Electronic', 'Retro'],
    bio: 'Neon Pulse brings the electric energy of the 80s into the modern era with pulsating synths and driving beats. Their music has been featured in numerous films and video games, establishing them as a leader in the synthwave revival movement.',
    songs: trendingSongs.slice(1, 5),
  },
  {
    id: 'artist-3',
    name: 'Coastal Echoes',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    monthlyListeners: 4100000,
    genres: ['Indie', 'Folk', 'Acoustic'],
    bio: 'Drawing inspiration from the sounds of the sea and coastal landscapes, Coastal Echoes creates soothing acoustic melodies that transport listeners to peaceful shores. Their intimate performances have garnered a devoted following worldwide.',
    songs: trendingSongs.slice(2, 6),
  },
]

export const reviews: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'MusicLover92',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Absolutely incredible track! The production quality is amazing and the melody stays with you for days. One of the best releases this year.',
    date: '2024-01-15',
    likes: 234,
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'BeatDropper',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop',
    rating: 4,
    comment: 'Great vibes and smooth transitions. Would love to hear more like this. The bass line is particularly impressive.',
    date: '2024-01-14',
    likes: 156,
  },
  {
    id: 'r3',
    userId: 'u3',
    userName: 'SynthFan2000',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'This is pure art. The way the synths blend with the vocals creates something truly magical. Been on repeat all week!',
    date: '2024-01-12',
    likes: 189,
  },
  {
    id: 'r4',
    userId: 'u4',
    userName: 'NightOwlBeats',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    rating: 4,
    comment: 'Perfect late-night listening material. The atmosphere is immersive and the sound design is top-notch.',
    date: '2024-01-10',
    likes: 98,
  },
]

export function formatPlays(plays: number): string {
  if (plays >= 1000000) {
    return `${(plays / 1000000).toFixed(1)}M`
  }
  if (plays >= 1000) {
    return `${(plays / 1000).toFixed(0)}K`
  }
  return plays.toString()
}
