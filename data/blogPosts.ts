export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  coverImage?: string
  tags?: string[]
  content: string
}

export const posts: Post[] = [
  {
    slug: 'introducing-soundwave',
    title: 'Introducing Soundwave: Discover Your Sound',
    excerpt: 'We built Soundwave to help you discover music that moves you. Here’s why we’re excited.',
    date: '2024-05-01',
    author: 'Team Soundwave',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=400&fit=crop',
    tags: ['product', 'announcement'],
    content: `
<p>Welcome to Soundwave — your personal music discovery companion. We believe music should be effortless and delightful. Our mission is to help you find songs that fit every mood.</p>

<h2>What we built</h2>
<p>Personalized recommendations, curated playlists, and a lightweight player — all in a beautiful interface.</p>

<h2>Join us</h2>
<p>We’re just getting started. Follow along for updates and behind-the-scenes posts.</p>
`,
  },
  {
    slug: 'how-we-recommend',
    title: 'How We Recommend Music',
    excerpt: 'A peek under the hood at our recommendation strategy.',
    date: '2024-05-10',
    author: 'Data Team',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=400&fit=crop',
    tags: ['engineering', 'recommendations'],
    content: `
<p>Recommendations combine listening patterns, moods, and editorial curation. We use lightweight heuristics optimized for speed.</p>

<h3>Mood signals</h3>
<p>We analyze tempo, energy, and listener context to map songs to moods.</p>
`,
  },
]
