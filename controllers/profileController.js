const connection = require("../connection");
const response = require("../response");

exports.updateProfile = (req, res) => {
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
};
