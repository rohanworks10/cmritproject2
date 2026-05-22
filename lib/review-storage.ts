import fs from 'fs'
import path from 'path'

export interface StoredReview {
  id: string
  targetId: string
  targetType: 'song' | 'interview' | string
  userId?: string
  userName: string
  userAvatar?: string
  rating: number
  title?: string
  comment: string
  likes?: number
  helpfulBy?: string[]
  createdAt: string
  updatedAt?: string
}

const FILE = path.join(process.cwd(), 'data', 'reviews.json')

function readAll(): StoredReview[] {
  try {
    if (!fs.existsSync(FILE)) return []
    const raw = fs.readFileSync(FILE, 'utf-8')
    return raw ? (JSON.parse(raw) as StoredReview[]) : []
  } catch (e) {
    return []
  }
}

function writeAll(data: StoredReview[]) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export function getReviewsForTarget(targetType: string, targetId: string): StoredReview[] {
  const all = readAll()
  return all
    .filter((r) => r.targetType === targetType && r.targetId === targetId)
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

export function addReviewForTarget(
  targetType: string,
  targetId: string,
  review: Omit<StoredReview, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'helpfulBy'>,
): StoredReview {
  const all = readAll()
  const now = new Date().toISOString()
  const stored: StoredReview = {
    ...review,
    id: `r-${Date.now()}`,
    targetId,
    targetType,
    likes: 0,
    helpfulBy: [],
    createdAt: now,
    updatedAt: undefined,
  }
  all.unshift(stored)
  writeAll(all)
  return stored
}

export function getAverageForTarget(targetType: string, targetId: string) {
  const reviews = getReviewsForTarget(targetType, targetId)
  if (!reviews.length) return { average: 0, count: 0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
  const breakdown = reviews.reduce((acc: Record<number, number>, r) => {
    acc[r.rating] = (acc[r.rating] ?? 0) + 1
    return acc
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  return { average: Number(avg.toFixed(2)), count: reviews.length, breakdown }
}

export function findReviewById(id: string): StoredReview | undefined {
  const all = readAll()
  return all.find((r) => r.id === id)
}

export function updateReview(id: string, userId: string | undefined, update: Partial<StoredReview>) {
  const all = readAll()
  const idx = all.findIndex((r) => r.id === id)
  if (idx === -1) return null
  const existing = all[idx]
  if (existing.userId && userId && existing.userId !== userId) return null
  const next = { ...existing, ...update, updatedAt: new Date().toISOString() }
  all[idx] = next
  writeAll(all)
  return next
}

export function deleteReview(id: string, userId?: string) {
  const all = readAll()
  const idx = all.findIndex((r) => r.id === id)
  if (idx === -1) return false
  if (all[idx].userId && userId && all[idx].userId !== userId) return false
  all.splice(idx, 1)
  writeAll(all)
  return true
}

export function toggleHelpful(reviewId: string, userId?: string) {
  const all = readAll()
  const idx = all.findIndex((r) => r.id === reviewId)
  if (idx === -1) return null
  const review = all[idx]
  const helpfulBy = new Set(review.helpfulBy ?? [])
  let liked = false
  if (userId) {
    if (helpfulBy.has(userId)) {
      helpfulBy.delete(userId)
      liked = false
    } else {
      helpfulBy.add(userId)
      liked = true
    }
    review.helpfulBy = [...helpfulBy]
    review.likes = review.helpfulBy.length
  } else {
    // anonymous toggle: flip based on truthiness
    review.likes = (review.likes ?? 0) + 1
    liked = true
  }
  review.updatedAt = new Date().toISOString()
  all[idx] = review
  writeAll(all)
  return { review, liked }
}
