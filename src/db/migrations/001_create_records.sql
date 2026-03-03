CREATE TABLE IF NOT EXISTS records (
  id          bigint      PRIMARY KEY,
  title       text        NOT NULL,
  artist      text        NOT NULL,
  year        integer,
  label       text,
  cover_image text,
  created_at  timestamptz DEFAULT now()
);
