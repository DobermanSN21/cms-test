const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middleware/authenticateToken");

router.put(
  "/profile/profile",
  authenticateToken,
  profileController.updateProfile
);

module.exports = router;
