const PLAY_HISTORY_KEY = 'soundwave-play-history'
const MAX_HISTORY = 10

export function getPlayHistory(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(PLAY_HISTORY_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function recordPlay(songId: string) {
  const history = getPlayHistory().filter((id) => id !== songId)
  const updated = [songId, ...history].slice(0, MAX_HISTORY)
  localStorage.setItem(PLAY_HISTORY_KEY, JSON.stringify(updated))
  window.dispatchEvent(new CustomEvent('play-history-changed'))
}
