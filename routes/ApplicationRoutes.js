const express=require("express");
const {applyJob, getAppliedJob, getApplicatns, updateStatus}=require("../controller/Application.controller");
const isAuthenticated = require("../middleware/isAuthenticated");

const router=express.Router();
router.route("/applyjob/:id").get(isAuthenticated,applyJob);
router.route("/getAppliedJob").get(isAuthenticated,getAppliedJob);
router.route("/getApplicatns/:id").get(isAuthenticated,getApplicatns);
router.route("/updateStatus/:id").post(isAuthenticated,updateStatus);

module.exports=router;





