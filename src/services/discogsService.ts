import { discogsFetch } from '@/lib/discogs'
import type { DiscogsArtistReleasesResponse, DiscogsRelease } from '@/types'

export async function getArtistReleases(artistId: string): Promise<DiscogsRelease[]> {
  try {
    const response: DiscogsArtistReleasesResponse = await discogsFetch(
      `/artists/${artistId}/releases?per_page=100`
    )
    
    return response.releases
  } catch (error) {
    console.error('Error fetching artist releases:', error)
    throw new Error('Failed to fetch artist releases from Discogs')
  }
}

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

export async function getReleaseDetails(releaseId: string): Promise<DiscogsRelease> {
  try {
    const release: DiscogsRelease = await discogsFetch(`/releases/${releaseId}`)
    
    return release
  } catch (error) {
    console.error('Error fetching release details:', error)
    throw new Error('Failed to fetch release details from Discogs')
  }
}
