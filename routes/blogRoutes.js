const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/blog", authenticateToken, blogController.createBlog);

module.exports = router;
