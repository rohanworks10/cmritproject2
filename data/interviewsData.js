export const interviewCategories = [
  'Behind the Music',
  'Studio Session',
  'World Tour',
  'Breakthrough',
  'Legacy',
]
export const demoInterviews = [
  {
    id: 'int-charlie-puth',
    artistName: 'Charlie Puth',
    interviewTitle: 'The Charlie Puth Interview',
    thumbnail: 'https://img.youtube.com/vi/M1ynEx-xiN0/maxresdefault.jpg',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/M1ynEx-xiN0',
    watchUrl: 'https://www.youtube.com/watch?v=M1ynEx-xiN0',
    duration: '1:05:42',
    category: 'Legacy',
    description:
      'Charlie Puth opens up about songwriting, vocal production, and the creative process behind his biggest hits.',
    publishedDate: '2024-04-12',
    featured: false,
  },
  {
    id: 'int-olivia-rodrigo',
    artistName: 'Olivia Rodrigo',
    interviewTitle: 'Olivia Rodrigo: Superstar Q&A | Billboard Live Music Summit 2024',
    thumbnail: 'https://img.youtube.com/vi/WbGFALJ2MP8/maxresdefault.jpg',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/WbGFALJ2MP8',
    watchUrl: 'https://www.youtube.com/watch?v=WbGFALJ2MP8',
    duration: '17:45',
    category: 'Behind the Music',
    description:
      'Olivia Rodrigo answers fan questions and shares stories about her rise to superstardom at Billboard Live Music Summit.',
    publishedDate: '2024-05-16',
    featured: false,
  },
  {
    id: 'int-ed-sheeran',
    artistName: 'Ed Sheeran',
    interviewTitle: 'Ep. 222: Ed Sheeran: What It Takes To Be Great',
    thumbnail: 'https://img.youtube.com/vi/jgVZkx5ttTY/maxresdefault.jpg',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/jgVZkx5ttTY',
    watchUrl: 'https://www.youtube.com/watch?v=jgVZkx5ttTY',
    duration: '1:24:14',
    category: 'World Tour',
    description:
      'Ed Sheeran talks about creative growth, touring life, and what it takes to stay great in the music industry.',
    publishedDate: '2023-08-02',
    featured: false,
  },
]

export function getInterviewById(id) {
  return demoInterviews.find((i) => i.id === id)
}

export function getFeaturedInterviews() {
  return demoInterviews.filter((i) => i.featured)
}
