const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./src/routes/index");
require("./src/database/mongoose");
require("dotenv").config();
const port = process.env.PORT;

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

app.use(bodyParser.json());
app.use(cookieParser());
app.use(routes);

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    ws.send(`Sent: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Case Home");
});

server.listen(port, () => {
  console.log(`Server is running in port http://localhost:${port}`);
});

module.exports = app;
