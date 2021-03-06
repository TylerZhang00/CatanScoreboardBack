DROP TABLE IF EXISTS players
CASCADE;
DROP TABLE IF EXISTS games
CASCADE;
DROP TABLE IF EXISTS game_details
CASCADE;

CREATE TABLE players
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE games
(
  id SERIAL PRIMARY KEY
);

CREATE TABLE game_details
(
  id SERIAL PRIMARY KEY,
  player_id int,
  score int DEFAULT 2,
  game_id int
);

ALTER TABLE game_details ADD FOREIGN KEY (player_id) REFERENCES players (id);

ALTER TABLE game_details ADD FOREIGN KEY (game_id) REFERENCES games (id);
