const Company = require("../models/company.model");
const mongoose = require("mongoose");
const getDataUri = require("../utils/datauri.js");
const cloudinary = require("../utils/cloudinary.js");
const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "comapany name is required !!",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "you can not register company with same name !!",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return res.status(200).json({
      company,
      message: "company registerd successfully !!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getCompanies = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId: userId });
    if (!companies) {
      return res.status(400).json({
        message: "you not registerd any company !!",
        success: false,
      });
    }
    if (companies.length == 0) {
      return res.status(401).json({
        message: "you not registerd company ",
        success: false,
      });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid company ID",
        success: false,
      });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "company with given id not found !!",
        success: false,
      });
    }
    return res.status(200).json({
      message: "company with  given id is found !!",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file=req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo=cloudResponse.secure_url;


    const updateData = { name, description, website, location,logo };
    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!company) {
      res.status(404).json({
        message: "company with  given id is not found !!",
        success: true,
      });
    }
    res.status(200).json({
      message: "company with  given id is updated !!",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  registerCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
};
