const connection = require("../connection");
const response = require("../response");

exports.createBlog = (req, res) => {
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
};
