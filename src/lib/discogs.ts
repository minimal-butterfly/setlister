"use server"

const DISCOGS_API_BASE = 'https://api.discogs.com'

export async function discogsFetch(endpoint: string, options: RequestInit = {}) {
  const DISCOGS_TOKEN = process.env.DISCOGS_TOKEN

  console.log('Running on server?', typeof window === 'undefined')
  console.log('Token exists?', !!process.env.DISCOGS_TOKEN)
  
  if (!DISCOGS_TOKEN) {
    throw new Error('Missing DISCOGS_TOKEN environment variable')
  }
  
  const url = `${DISCOGS_API_BASE}${endpoint}`
  
  const headers = {
    'User-Agent': 'SetlisterApp/1.0',
    'Authorization': `Discogs token=${DISCOGS_TOKEN}`,
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`Discogs API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
