const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");
const connection = require("./connection");
const response = require("./response");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

app.use(bodyParser.json());

// Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) return response(401, {}, "Token required", res);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return response(403, {}, "Invalid token", res);
    req.user = user;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("Welcome to the CMS API");
});

// API untuk register
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const sql = `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`;
  connection.query(sql, [username, email, password], (err, fields) => {
    if (err) return response(500, {}, "Internal Server Error", res);
    response(200, { id: fields.insertId }, "User registered successfully", res);
  });
});

// API untuk login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM user WHERE email = ?`;
  connection.query(sql, [email], async (err, results) => {
    if (err) return response(500, {}, "Internal Server Error", res);
    if (results.length === 0) return response(404, {}, "User not found", res);
    const user = results[0];
    const validPassword = password;
    if (!validPassword) return response(403, {}, "Try again!", res);
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });
    response(200, { token }, "Login successful", res);
  });
});

// API untuk membuat konten blog
app.post("/blog", authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const sql = `INSERT INTO blog (title, content, user_id) VALUES (?, ?, ?)`;
  connection.query(sql, [title, content, userId], (err, fields) => {
    if (err) return response(500, {}, "Internal Server Error", res);
    response(
      200,
      { id: fields.insertId },
      "Blog post created successfully",
      res
    );
  });
});

// API untuk mengedit profil
app.put("/profile/profile", authenticateToken, (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.user.id;
  const pwd = password;
  const sql = `UPDATE user SET username = ?, email = ?, password = ? WHERE id = ?`;
  connection.query(sql, [username, email, pwd, userId], (err, fields) => {
    if (err) return response(500, {}, "Internal Server Error", res);
    if (fields.affectedRows === 0)
      return response(404, {}, "User not found", res);
    response(200, {}, "Profile updated successfully", res);
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
