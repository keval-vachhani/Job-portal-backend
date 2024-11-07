const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const {
  registerCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} = require("../controller/company.controller");
const singleUpload = require("../middleware/multer");
const router = express.Router();
router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompanies);
router.route("/getbyId/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated,singleUpload, updateCompany);

module.exports = router;
