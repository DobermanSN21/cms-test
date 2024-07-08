const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");

require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the CMS API");
});

app.use("/", authRoutes);
app.use("/", blogRoutes);
app.use("/", profileRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
