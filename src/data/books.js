const STORAGE_KEY = 'nextread_books'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'

export const initialBooks = [
  { id: 1, title: 'The Example Book', author: 'Jane Doe', rating: 4.5, status: 'Available', image: '/book-1.svg' },
  { id: 2, title: 'Another Book', author: 'John Smith', rating: 4.0, status: 'Available', image: '/book-2.svg' },
]

export async function loadBooks() {
  try {
    const res = await fetch(`${API_BASE}/books`)
    if (!res.ok) throw new Error('Bad response')
    const data = await res.json()
    // keep a local copy for offline fallback
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
  } catch (err) {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialBooks
    try {
      return JSON.parse(raw)
    } catch {
      return initialBooks
    }
  }
}

export async function createBook(book) {
  try {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    })
    if (!res.ok) throw new Error('Failed to create')
    const created = await res.json()
    // update local cache
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    localStorage.setItem(STORAGE_KEY, JSON.stringify([created, ...current]))
    return created
  } catch (err) {
    // fallback to client-side only
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const id = Date.now()
    const created = { ...book, id }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([created, ...current]))
    return created
  }
}

export function loadLocalBooks() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return initialBooks
  try { return JSON.parse(raw) } catch { return initialBooks }
}
