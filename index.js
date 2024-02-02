const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const router = express.Router();

const port = process.env.PORT;

app.listen(port, () =>
  console.log(`Example this app listening on port ${port}!`)
);
// serve your css as static
app.use(express.static(__dirname));

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.use("/", router);
