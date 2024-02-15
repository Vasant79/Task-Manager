const express = require("express");
const { mainRoute } = require("./routes/mainRoute");
const { dbConnection } = require("./database/db");

const app = express();
const PORT = 3001;

dbConnection();
app.use(express.json());
app.use("/api/v1", mainRoute);

app.listen(PORT, function (req, res) {
  console.log("server running on ", PORT);
});
