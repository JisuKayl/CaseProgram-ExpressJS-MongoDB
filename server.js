const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./Routing.js");
const db = require("./DbCon.js");
const port = 3000;

app.use(bodyParser.json());
app.use(routes);

app.get("/", (req, res) => {
  res.send("Case Home");
});

app.listen(port, () => {
  console.log(`Server is running in port http://localhost:${port}`);
});

module.exports = app;
