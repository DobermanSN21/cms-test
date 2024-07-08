const jwt = require("jsonwebtoken");
const response = require("../response");
const secretKey = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) return response(401, {}, "Token required", res);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return response(403, {}, "Invalid token", res);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
