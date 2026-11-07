-- Discogs uses year 0 for "unknown". Store it as NULL so it sorts last.
UPDATE records SET year = NULL WHERE year = 0;

-- Artist key for A–Z sorting: lowercase, no leading "The ",
-- no trailing Discogs disambiguation like " (2)".
-- Generated, so existing rows are backfilled and new inserts fill it automatically.
ALTER TABLE records
  ADD COLUMN IF NOT EXISTS sort_artist text GENERATED ALWAYS AS (
    regexp_replace(
      regexp_replace(lower(artist), '\s\(\d+\)$', ''),
      '^the\s+', ''
    )
  ) STORED;

-- Each sort uses id as a tiebreaker, so index (column, id).
-- Ascending and descending both use the same index (scanned in reverse),
-- except year descending, which needs its own index because nulls go last in both directions.
CREATE INDEX IF NOT EXISTS records_sort_artist_idx ON records (sort_artist, id);
CREATE INDEX IF NOT EXISTS records_created_at_idx  ON records (created_at, id);
CREATE INDEX IF NOT EXISTS records_year_idx        ON records (year, id);
CREATE INDEX IF NOT EXISTS records_year_desc_idx   ON records (year DESC NULLS LAST, id DESC);
