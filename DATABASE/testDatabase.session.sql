-- @BLOCK
SHOW TABLES;
-- @BLOCK
select *
from users;
-- @BLOCK
select *
from games;
-- @BLOCK
INSERT INTO games(
        userId,
        gamesTotal,
        winsTotal,
        gamesThisWeek,
        winsThisWeek,
        gamesToday,
        winsToday
    )
VALUES (34, 0, 0, 0, 0, 0, 0);
-- @BLOCK 
INSERT INTO users(username, mail, passPhrase)
VALUES('pepik', 'pepik@gfg.com', 'dffgggf');
-- @BLOCK
select users.username,
    games.*
from users,
    games
WHERE users.id = games.userId;
from users,
    games
WHERE users.id = games.userId;
-- @BLOCK
UPDATE games
SET gamesTotal = gamesTotal + 1,
    gamesThisWeek = gamesThisWeek + 1,
    gamesToday = gamesToday + 1,
    winsTotal = (
        case
            when userId = 34 then winsTotal + 1
            when userId = 36 then winsTotal
        end
    ),
    winsThisWeek = (
        case
            when userId = 34 then winsThisWeek + 1
            when userId = 36 then winsThisWeek
        end
    ),
    winsToday = (
        case
            when userId = 34 then winsToday + 1
            when userId = 36 then winsToday
        end
    )
where userId in (34, 36);
-- @BLOCK
select users.username,
    games.*
from users,
    games
WHERE users.id = games.userId
    and users.id in (37, 38);
-- @BLOCK
DELETE from users
where id;
-- @BLOCK
DELETE from games
where userid;
--@BLOCK
UPDATE games
SET gamesThisWeek = 0,
    winsThisWeek = 0
WHERE userId;
--@BLOCK
UPDATE games
SET gamesToday = 0,
    winsToday = 0
WHERE userId;