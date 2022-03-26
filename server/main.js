const express = require("express");
const cors = require("cors");
const path = require("path")
const https = require('https');
const http = require('http');
const app = express();
const dirname = __dirname;
const fs = require("fs")
require("dotenv").config();

const node_env = process.env.NODE_ENV === 'development';
const httpsPort = process.env.SSLPORT || -1;
const httpPort = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", require("./requests/user"));
app.use("/game", require("./requests/wsManager"));
app.use("/stats", require("./requests/stats"))
app.use("*/app", express.static(path.join(dirname, "build")));

app.get("/", (req, res) => {
  res.redirect('/app')
})
app.get("/app/*", (req, res) => {
  res.sendFile(path.join(dirname, 'build', 'index.html'))
})



//start
const server = node_env ? (
  http.createServer(app).listen(httpPort, '0.0.0.0', () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log(`Server started at: http://${host}:${port}`);
  })
)
  : (
    https.createServer({
      key: fs.readFileSync(path.join(__dirname, 'ssl', 'privatekey.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.pem'))
    }, app).listen(httpsPort, '0.0.0.0', () => {
      let host = server.address().address;
      let port = server.address().port;
      console.log(`Server started at: https://${host}:${port}`);
    })
  )

if (!node_env) {
  const redirectServer = http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  });
  redirectServer.listen(httpPort)
}

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, function (ws) {
    wss.emit("connection", ws, request);
  });
});