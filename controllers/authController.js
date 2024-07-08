const connection = require("../connection");
const response = require("../response");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

exports.register = (req, res) => {
  const { username, email, password } = req.body;
  const sql = `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`;
  connection.query(sql, [username, email, password], (err, fields) => {
    if (err) return response(500, {}, "Internal Server Error", res);
    response(200, { id: fields.insertId }, "User registered successfully", res);
  });
};

exports.login = (req, res) => {
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
};
