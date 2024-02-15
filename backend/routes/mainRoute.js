const express = require("express");
const { guestRoute } = require("./guestRoute");
const mainRoute = express.Router();

mainRoute.use("/guest", guestRoute);
module.exports = {
  mainRoute,
};
