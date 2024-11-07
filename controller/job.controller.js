const Job = require("../models/job.model");
const postJob = async (req, res) => {
  const userId = req.id;
  
  try {
    const {
      title,
      description,
      requirments,
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      companyId,
    } = req.body;

    if (
      !title ||
      !description ||
      !requirments ||
      !salary ||
      !experienceLevel ||
      !location ||
      !jobType ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "missing some fields for posting new job!",
        success: false,
      });
    }
   
    const job = await Job.create({
      title: title,
      description: description,
      requirments: requirments.split(","),
      salary: Number(salary),
      experienceLevel: Number(experienceLevel),
      location: location,
      jobType: jobType,
      position: Number(position),
      company: companyId,
      createdBy: userId,
    });
    return res.status(201).json({
      message: "job created successfully!",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "job not found!",
        success: false,
      });
    }
    return res.status(201).json({
      message: "jobs found successfully!",
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
  .populate({
    path: "applications",
  })
  .populate({
    path: "company",
  })
  .populate({
    path: "createdBy", 
  });

    if (!job) {
      return res.status(404).json({
        message: "job not found!",
        success: false,
      });
    }
    return res.status(200).json({
      message: "job found successfully!",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const getJobCreatedByAdmin = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ createdBy: adminId }).populate({
      path: "company",
    });
    if (!jobs) {
      return res.status(404).json({
        message: "job not found!",
        success: false,
      });
    }
    return res.status(200).json({
      message: "jobs  found!",
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { postJob, getAllJobs, getJobById, getJobCreatedByAdmin };
