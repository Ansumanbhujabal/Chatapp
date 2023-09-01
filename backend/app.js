const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "backend/config/config.env" });
}
//Using middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieparser());
//importing routes
const post = require("./routes/post");
const user = require("./routes/user");
//Using Routes
app.use("/api/v1", post);
app.use("/api/v1", user);

module.exports = app;
