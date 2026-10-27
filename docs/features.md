# Setlister: Task Flows & Screen Map

> Setlister is a pocket crate for vinyl DJs: a private record collection and setlist sketchpad that lives in one place. It is not a performance tool and not a Rekordbox competitor. Sets are ultimately rehearsed and played on real vinyl, on real decks.

This document defines the core user flows and the screens they touch. It is the bridge between the feature list and the layout/component work. Every feature should live inside at least one flow.

**Status key:** ✅ built · 🚧 in progress · 📋 planned · 💡 idea / later

---

## Screens

| Screen | Route | Used in flows |
|---|---|---|
| Search | `/search` | 1 |
| My Collection | `/collection` | 2, 3 |
| Record Detail | `/record/[id]` | 1, 2 |
| My Setlists | `/setlists` | 3, 4 |
| Setlist Editor | `/setlists/[id]/edit` | 3, 4 |

Persistent UI across all screens: primary navigation (Search · Collection · Setlists) and the theme switcher (Techno · Acid · Trance).

Record Detail and Setlist Editor each serve two flows, so they deserve the most design attention.

---

## Flow 1: Add a record to my collection

**Goal:** I found a new record. I want to look it up and save it to my private collection so I always know what I own.

| # | Screen | Action | Notes |
|---|---|---|---|
| 1 | Search | Type artist or title | Debounced input, results from the Discogs API, no page reload |
| 2 | Search | Scan results | Cards show cover, artist, title, year, label. "In collection" badge if already saved |
| 3 | Record Detail | Review and confirm | Full tracklist, genres, styles. Check it is the right pressing |
| 4 | Record Detail | "Save to Collection" | One action. Saved to Supabase, badge appears |

**API calls**
- `GET /api/search?q=` → Discogs
- `POST /api/collection` → Supabase

**Status:** ✅ search · ✅ record detail · ✅ collection API · 📋 "In collection" badge · 📋 search pagination

---

## Flow 2: Browse and filter my collection

**Goal:** See what I own and find records by genre, style, label or BPM, like flipping through a physical crate, but faster.

| # | Screen | Action | Notes |
|---|---|---|---|
| 1 | My Collection | Open collection | All saved records, default sort: recently added |
| 2 | My Collection | Filter / sort | Genre, style, label, year, BPM range. Stackable filters |
| 3 | My Collection | Scan filtered results | Grid/list with cover art and key metadata at a glance |
| 4 | Record Detail | Open a record | Tracklist, BPM, key, links out to Bandcamp and Discogs pricing |

**Branches from Record Detail**
- Add to a setlist (existing or new)
- Remove from collection
- Find BPM / key (lookup or manual entry)

**Design notes**
- Physical collections are sorted in one way only. Digitally, one record can belong to many groupings, so the collection must be filterable in as many ways as possible. Cross-genre records that defy a single category are the main pain point.
- Filter logic must cover every scenario (stackable, combinable, clearly resettable). Check which fields the Discogs API exposes for filtering and decide what is filtered server-side (Supabase) versus client-side.
- 💡 Crates: user-defined groupings of records (for example "warm-up", "gig bag Berlin"), separate from the general collection. A record can sit in several crates.

**API calls**
- `GET /api/collection` → Supabase (with filter params)
- `GET /api/getsongbpm` → BPM and key lookup (see below)

**Status:** 🚧 collection API and view · 📋 filters and sort · 💡 crates

---

## Flow 3: Build a setlist

**Goal:** I have a gig coming up. I want to pull records from my collection into an ordered list and plan my transitions.

| # | Screen | Action | Notes |
|---|---|---|---|
| 1 | My Setlists | "Create New Setlist" | Name it. Optional: date, venue. Opens the editor |
| 2 | Setlist Editor | Add records | Pick from the collection. Record appears in the ordered list |
| 3 | Setlist Editor | Reorder | Drag and drop, with a keyboard-accessible up/down alternative. BPM and key shown beside each entry |
| 4 | Setlist Editor | Write transition notes | Between each pair of tracks, for example "long blend", "cut on the 1", "drop to half-time" |

**Also possible from Record Detail:** add a record (or a track from its tracklist) to an existing setlist or to a new one, via a dropdown or sheet.

**Branches**
- Remove tracks from a setlist
- 💡 "Suggest next track" from my own collection (see Later)

**API calls**
- `POST /api/setlists` → create
- `POST /api/setlists/[id]/tracks` → add record
- `PATCH /api/setlists/[id]/tracks` → reorder and notes

**Status:** 📋 setlists list · 📋 editor · 📋 drag and drop · 📋 transition notes

---

## Flow 4: Prepare for a gig

**Goal:** The gig is tomorrow. Review the setlist, check the flow, adjust if needed, and use it as a reference.

| # | Screen | Action | Notes |
|---|---|---|---|
| 1 | My Setlists | Open the gig setlist | Track count, date, venue at a glance |
| 2 | Setlist Editor | Review the flow | Scan BPM progression, check key compatibility, read transition notes |
| 3 | Setlist Editor | Tweak or finalize | Swap tracks, adjust order, add last-minute finds from the collection |
| 4 | Setlist Editor | Use as reference | Phone near the booth: glance at the next record and its transition note |

**After the gig**
- Mark which tracks were actually played
- The setlist becomes part of a set archive, which also shows which records often go together

**Later:** offline mode (PWA) so this works without wifi at the venue.

**Status:** 📋 depends on Flow 3

---

## BPM and key data

Discogs does not provide BPM or key. Strategy, in order:

1. **Lookup** via the GetSongBPM API (free, requires a visible backlink to getsongbpm.com; returns tempo and key). Triggered by a "Find BPM" button on Record Detail, never automatic.
2. **Manual entry** is always available and is the fallback for obscure releases that are not in the database.
3. **Store the result** in the database so each track is looked up only once.
4. 💡 **Browser detection** with the Web Audio API (for example `web-audio-beat-detector`) from an uploaded or recorded audio source. Works best for steady 4/4 electronic music.

BPM and key are optional fields. The app trusts the DJ and never blocks on missing data.

---

## Later (not in the portfolio scope)

- 💡 "Suggest next track": rule-based first (Camelot wheel key compatibility, BPM within a tolerance or double/half time, genre affinity), optionally LLM-assisted
- 💡 Discogs OAuth / collection import
- 💡 PWA with offline mode
- 💡 Barcode or sleeve-photo recognition (mobile)
- 💡 Play history across multiple gigs (keeping sets fresh)
- 💡 Share or export a setlist (link, PDF, image)

---

## Principles

- **Catalogue, editor, sketchpad.** The app does not try to make DJing easier or replace playing on real decks.
- **Focused views.** One task at a time. Complexity appears in response to user intent, not by default.
- **Accessible by default.** Semantic HTML, keyboard navigation, WCAG AA contrast in all three themes.
- **Structure is theme-independent.** Layout and components are shared. Themes change colour, typography, radius, shadow and motion only.
