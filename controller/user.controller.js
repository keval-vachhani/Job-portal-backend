const User = require("../models/user.model"); ///////////////////
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/datauri.js");
const cloudinary = require("../utils/cloudinary.js");
const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "some field are missing",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "user already exist with this email!!",
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
 
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
      role: role,
      profile:{
        profilePhoto:cloudResponse.secure_url
      }
    });
    return res.status(201).json({
      message: "user created successfully!!!",
      success: true,
    });
  } catch (error) {
    console.log("error in register ", error);
    res.send({ error });
  }
};
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "some field for login is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "user not exist with this email",
        success: false,
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        message: "incorrect password !!",
        success: false,
      });
    }
    console.log("code run");
    if (role !== user.role) {
      return res.status(401).json({
        message: "user with this role not exist",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "None",
        secure: true,
      })
      .json({
        message: `welcome back ${user.fullName}`,
        user,
        token,
        success: true,
      });
  } catch (error) {
    console.log("error in login ", error);
    res.send(error);
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "loged out successfully!!",
      success: true,
    });
  } catch (error) {
    console.log("error in logout ", error);
    res.send(error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content,
 {
  resource_type:"raw",
  use_filename:true
 }

    );
    let skillArray;

    if (skills) {
      skillArray = skills.split(",");
    }
    const userId = req.id; //from authentication middleware
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "user not found for update",
        success: false,
      });
    }
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillArray;

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url; // save the cloudinary url
      user.profile.resumeOriginalName = file.originalname; // Save the original file name
    }

    await user.save();
    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res.status(200).json({
      message: "user updated successfully!!",
      user,
      success: true,
    });
  } catch (error) {
    console.log("error in update ", error);
    res.send(error);
  }
};
module.exports = { register, login, logout, updateProfile };
