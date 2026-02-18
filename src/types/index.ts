// Database types based on the schema
export interface Record {
  id: string
  title: string
  artist: string
  year?: number
  label?: string
  cover_image?: string
  created_at: string
}

export interface Track {
  id: string
  record_id: string
  title: string
  artist: string
  bpm?: number
  key?: string
  length?: string // interval type from PostgreSQL
}

export interface DJSet {
  id: string
  title: string
  type: 'club' | 'radio' | 'streaming' | 'other'
  venue?: string
  description?: string
  bpm_range_start?: number
  bpm_range_end?: number
  genres: string[]
  styles: string[]
  tags: string[]
  created_at: string
}

export interface SetlistTrack {
  id: string
  set_id: string
  track_id: string
  position: number
  transition_notes?: string
  created_at: string
}

// Join types for populated data
export interface SetlistTrackWithDetails extends SetlistTrack {
  track: Track & {
    record: Record
  }
}

export interface DJSetWithTracks extends DJSet {
  setlist_tracks: SetlistTrackWithDetails[]
}

// Discogs API types
export interface DiscogsRelease {
  id: number
  title: string
  artist: string
  year: number
  label: string
  resource_url: string
  thumb?: string
  cover_image?: string
  tracklist: DiscogsTrack[]
  genres?: string[]
  styles?: Array<string>,
  labels?: Array<{
    name: string
    catno: string
    entity_type: string
    entity_type_name: string
    id: number
    resource_url: string
  }>
}

export interface DiscogsTrack {
  position: string
  title: string
  duration: string
  artists?: Array<{
    name: string
    join: string
  }>
}

export interface DiscogsArtist {
  id: number
  name: string
  resource_url: string
  releases_url: string
}

export interface DiscogsArtistReleasesResponse {
  releases: DiscogsRelease[]
  pagination: {
    page: number
    pages: number
    per_page: number
    items: number
    urls: {
      first: string
      prev: string
      next: string
      last: string
    }
  }
}
