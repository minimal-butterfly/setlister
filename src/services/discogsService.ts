import { discogsFetch } from '@/lib/discogs'
import type { DiscogsRelease } from '@/types'

export async function searchReleases(query: string): Promise<DiscogsRelease[]> {
  try {
    const response = await discogsFetch(
      `/database/search?q=${encodeURIComponent(query)}&type=release&per_page=50`
    )

    return response.results
  } catch (error) {
    console.error('Error searching releases:', error)
    throw new Error('Failed to search releases from Discogs')
  }
}

export async function getReleaseDetails(releaseId: number): Promise<DiscogsRelease> {
  try {
    const release: DiscogsRelease = await discogsFetch(`/releases/${releaseId}`)

    return release
  } catch (error) {
    console.error('Error fetching release details:', error)
    throw new Error('Failed to fetch release details from Discogs')
  }
}
