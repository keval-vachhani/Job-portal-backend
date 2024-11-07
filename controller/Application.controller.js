const Application = require("../models/application.model");
const job = require("../models/job.model");
const Job = require("../models/job.model");
const { stringify } = require("flatted");

const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const JobId = req.params.id;
    if (!JobId) {
      return res.status(400).json({
        message: "job id is required",
        success: false,
      });
    }
    const job = await Job.findById(JobId);
    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }
    //check already applied
    const isexistingApplication = await Application.findOne({
      job: JobId,
      applicant: userId,
    });
    if (isexistingApplication) {
      return res.status(400).json({
        message: "already applied !!",
        success: false,
      });
    }
    const application = await Application.create({
      job: JobId,
      applicant: userId,
    });
    job.applications.push(application._id);
    await job.save();
    return res.status(200).json({
      message: "successfully applied for this job",
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAppliedJob = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { createdAt: -1 },
        populate: {
          path: "company",
          options: { createdAt: -1 },
        },
      });
    if (!applications) {
      return res.status(400).json({
        message: "not applied for job",
        success: false,
      });
    }
    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getApplicatns = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant",
      },
    });
    if (!job) {
      return res.status(400).json({
        message: "no applicatnt found",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: " status not sent !!",
        success: false,
      });
    }
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(400).json({
        message: " application not found !!",
        success: false,
      });
    }
    application.status = status.toLowerCase();
    await application.save();
    return res.status(200).json({
      message: " application status updated !!",
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { applyJob, getApplicatns, getAppliedJob, updateStatus };
