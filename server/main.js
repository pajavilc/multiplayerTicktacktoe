const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path")
const app = express();
const dirname = __dirname;
const { authenticateUser } = require("./requests/user");
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(
  cors({
    origin: "*"/*process.env.FRONTEND_ADDRESS*/,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
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
const server = app.listen(port, '0.0.0.0', () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log(`Server started at: http://${host}:${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, function (ws) {
    wss.emit("connection", ws, request);
  });
});