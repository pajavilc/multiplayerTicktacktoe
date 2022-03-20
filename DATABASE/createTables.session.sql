-- @BLOCK
CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) UNIQUE NOT NULL,
    mail VARCHAR(255) UNIQUE,
    passPhrase VARCHAR(255) not NULL check(Length(passPhrase) > 6),
    refreshToken VARCHAR(255)
);
-- @BLOCK
CREATE TABLE IF NOT EXISTS games(
    userId INT PRIMARY KEY,
    gamesTotal INT,
    winsTotal INT,
    gamesThisWeek INT,
    winsThisWeek INT,
    gamesToday INT,
    winsToday INT
);
-- @BLOCK 
DROP TABLE games;