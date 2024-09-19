const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./Routing.js");
const db = require("./DbCon.js");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(routes);

app.get("/", (req, res) => {
  res.send("Case Home");
});

app.listen(port, () => {
  console.log(`Server is running in port http://localhost:${port}`);
});

module.exports = app;
