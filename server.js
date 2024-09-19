const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./src/routes/allRoutes");
const cookieParser = require("cookie-parser");
require("./dbCon");
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
