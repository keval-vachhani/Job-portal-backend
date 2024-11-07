const express = require("express");
const {
  register,
  login,
  updateProfile,
  logout,
} = require("../controller/user.controller");
const isAuthenticated = require("../middleware/isAuthenticated");
const singleUpload = require("../middleware/multer");
const router = express.Router();
router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);

module.exports = router;
