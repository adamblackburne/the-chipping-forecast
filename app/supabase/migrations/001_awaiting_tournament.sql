-- Allow groups to be created before a tournament is announced.
-- Run this in the Supabase SQL editor if you already have a live database.

alter table competitions
  alter column tournament_espn_id drop not null,
  alter column tournament_name    drop not null,
  alter column pick_deadline      drop not null;

alter table competitions
  drop constraint if exists competitions_status_check;

alter table competitions
  add constraint competitions_status_check
  check (status in ('awaiting_tournament', 'open', 'live', 'completed'));

-- Backfill any existing rows that have a tournament but are still 'open'
-- (no change needed — they already have tournament data and the right status)
