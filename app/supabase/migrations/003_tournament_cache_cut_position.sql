-- Store cut position per tournament so all groups share one cached value.
-- raw_data gets a default so we can insert cut_position-only rows.
alter table tournament_cache
  add column if not exists cut_position int;

alter table tournament_cache
  alter column raw_data set default '{}'::jsonb;
