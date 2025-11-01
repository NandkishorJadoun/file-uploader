require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "tiny-drive",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    console.log(filePath);
    if (!filePath) return null;
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(filePath);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = uploadOnCloudinary;
