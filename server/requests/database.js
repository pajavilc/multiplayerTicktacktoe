const { reject } = require("bcrypt/promises");
const mysql = require("mysql");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DBhost,
  port: process.env.DBport,
  user: process.env.DBuser,
  database: process.env.DB,
  password: process.env.DBpassword,
  connectionLimit: 10,
});
async function Register(username, password, mail) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      const searchForUser = `select id from users where username='${username}' ${mail !== null ? `or mail='${mail}` : ''}`;
      const createUser = `INSERT INTO users(username, ${(mail !== null ? "mail," : "")} passPhrase) VALUES ('${username}', ${(mail !== null ? `${mail},` : '')} '${password}');`;
      connection.query(searchForUser, (err, result) => {
        if (err) {
          connection.release();
          { return reject(err) };
        }

        if (result.length > 0) {
          connection.release();
          resolve(0);
        } else {
          connection.query(createUser, (err, result) => {
            if (err) { return reject(err) };
            connection.query(searchForUser, (err, result) => {
              if (err) { return reject(err) };

              id = result[0].id;
              const createGameRecord = `INSERT INTO games(userId,gamesTotal,winsTotal,gamesThisWeek,winsThisWeek,gamesToday,winsToday) VALUES (${id}, 0, 0, 0, 0, 0, 0);`
              connection.query(createGameRecord, (err, result) => {
                if (err) { return reject(err) };
                connection.release();
                resolve(1);
              })
            })
          });
        }
      });
    });
  });
}
async function findUser(username) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) { return reject(err) };
      const request = `select id,username,passPhrase as password from users where username='${username}'`;
      connection.query(request, (err, result) => {
        connection.release();
        if (err) { return reject(err) };
        resolve(result);
      });
    });
  });
}
async function storeJWT(id, refreshToken) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) { return reject(err) };

      const request = `UPDATE users set refreshToken='${refreshToken}' where id='${id}'`;
      connection.query(request, (err, result) => {
        connection.release();
        if (err) { return reject(err) };
        resolve();
      });
    });
  });
}
async function Logout(username) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) { return reject(err) };
      const request = `UPDATE users set refreshToken=NULL WHERE username='${username}'`;
      connection.query(request, (err, result) => {
        connection.release();
        if (err) { return reject(err) };
        resolve(true);
      });
    });
  });
}
async function CheckJWTPresence(username, refreshToken) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) { return reject(err) };
      const request = `select refreshToken from users where username='${username}'`;
      connection.query(request, (err, result) => {
        connection.release();
        if (err) { return reject(err) };
        const token = result[0].refreshToken;
        resolve(token === refreshToken && token != null);
      });
    });
  });
}
async function PlayerGameSave(winningPlayerId, losingPlayerId) {
  const saveWinningPlayer = `UPDATE games SET gamesTotal = gamesTotal + 1, gamesThisWeek = gamesThisWeek + 1, gamesToday = gamesToday + 1, winsTotal = ( case when userId = ${winningPlayerId} then winsTotal + 1 \nwhen userId = ${losingPlayerId} then winsTotal \nend ), winsThisWeek = ( case when userId = ${winningPlayerId} then winsThisWeek + 1 \nwhen userId = ${losingPlayerId} then winsThisWeek \nend ), winsToday = ( case when userId = ${winningPlayerId} then winsToday + 1\n when userId = ${losingPlayerId} then winsToday \nend ) where userId in (${winningPlayerId},${losingPlayerId});`
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) { return reject(err) };
      connection.query(saveWinningPlayer, (err, result) => {
        if (err) {
          return reject(err);
        }
        connection.release();
        resolve(1);
      })
    })
  })
}
async function GameWasTieSave(playerId1, playerId2) {
  const save = `UPDATE games SET gamesTotal = gamesTotal + 1 , gamesThisWeek = gamesThisWeek + 1 , gamesToday = gamesToday + 1 where userId in (${playerId1},${playerId2});`;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) { return reject(err) };
      connection.query(save, (err, result) => {
        if (err) {
          return reject(err)
        }
        connection.release();
        resolve(1);

      })
    })
  })
}
async function ReturnPlayersData(playerId1, playerId2) {
  const request = `select games.gamesTotal, games.winsTotal from users, games WHERE users.id = games.userId and users.id in (${(playerId1 !== -1 ? playerId1 : playerId2)},${(playerId2 !== -1 ? playerId2 : playerId1)});`
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) { return reject(err) };
      connection.query(request, (err, result) => {
        if (err) {
          return reject(err);
        }
        connection.release();
        resolve(result);
      })
    })
  })
}
async function ReturnUserData(userId) {
  const request = `select users.username , games.* from users, games WHERE users.id = games.userId AND users.id = ${userId};`
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) { return reject(err) };
      connection.query(request, (err, result) => {
        if (err) {
          return reject(err);
        }
        connection.release();
        resolve(result);
      })
    })
  })
}
async function ClearWeekGames() {
  const request = `UPDATE games SET gamesThisWeek = 0, winsThisWeek = 0 WHERE userId;`
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) { return reject(err) };
      connection.query(request, (err, result) => {
        if (err) {
          return reject(err);
        }
        connection.release();
        resolve(result);
      })
    })
  })
}
async function ClearDayGames() {
  const request = `UPDATE games SET gamesToday = 0, winsToday = 0 WHERE userId;`
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) { return reject(err) };
      connection.query(request, (err, result) => {
        if (err) {
          return reject(err);
        }
        connection.release();
        resolve(result);
      })
    })
  })
}

module.exports = { ClearWeekGames, ClearDayGames, pool, Register, findUser, storeJWT, Logout, CheckJWTPresence, GameWasTieSave, PlayerGameSave, ReturnUserData, ReturnPlayersData }
