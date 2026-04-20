-- Snapshot the cut position once R3 begins so it can't drift as positions shuffle.
-- The leaderboard API writes this on the first request after currentRound >= 3.
alter table competitions
  add column if not exists cut_position_snapshot int;
