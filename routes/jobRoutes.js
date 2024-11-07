const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const {
  postJob,
  getAllJobs,
  getJobById,
  getJobCreatedByAdmin,
} = require("../controller/job.controller");
const router = express.Router();
router.route("/postjob").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/postedjob").get(isAuthenticated, getJobCreatedByAdmin);

module.exports = router;
