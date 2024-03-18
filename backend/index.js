import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ImageKit from 'imagekit';
import cors from "cors";
// import { v4 as uuidv4 } from 'uuid';

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';


const app = express();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
})

const upload = multer({ storage: multer.memoryStorage() });





// Load environment variables from .env file
dotenv.config();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 7000;

const MONGOURL = process.env.CONNECTION_STRING;
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


var imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATEKEY,
  urlEndpoint: process.env.IMAGEKIT_URL
});

// Connect to MongoDB and start the server
mongoose.connect(MONGOURL).then(() => {
  console.log("Database connected successfully.");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Define the schema for portfolio
const portfolioSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
});

// Create a model for portfolio
const PortfolioModel = mongoose.model("portfolio", portfolioSchema);

app.post("/portfolio", upload.single('imageUrl'), async (req, res) => {
  try {
    const { title, description } = req.body;

    //FOR IMAGEKIT
    const fileBuffer = req.file.buffer;
    const imageUploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: req.file.originalname,
      tags: ['portfolio'],
    });

    const tempDir = './temp';
    const publicId = `${"portfolio"}_${Date.now()}`;
    const fileExtension = req.file.originalname.split('.').pop();
    const tempFilePath = path.join(tempDir, `${publicId}.${fileExtension}`); // Define the temporary file path

    // Create the temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Write buffer to the file
    fs.writeFileSync(tempFilePath, fileBuffer);
    //ImageKit


    //Cloudionary
    cloudinary.uploader.upload(tempFilePath,
      { public_id: publicId, overwrite: true },
      function (error, result) { console.log(result); }
    );
    // Extract image URL from ImageKit response
    const imageUrl = imageUploadResponse.url;

    // Create a portfolio item with the image URL
    const portfolioItem = new PortfolioModel({ title, description, imageUrl });

    // Save portfolio item to database
    const savedPortfolioItem = await portfolioItem.save();

    // Send the saved portfolio item as response
    res.json(savedPortfolioItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all portfolio items
app.get("/portfolio", async (req, res) => {
  try {
    const portfolioItems = await PortfolioModel.find();
    res.json(portfolioItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific portfolio item by ID
app.get("/portfolio/:id", async (req, res) => {
  try {
    const portfolioItem = await PortfolioModel.findById(req.params.id);
    if (!portfolioItem) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }
    res.json(portfolioItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a portfolio item
app.put("/portfolio/:id", upload.single('imageUrl'), async (req, res) => {
  try {


    const { title, description } = req.body;

    //FOR IMAGEKIT
    const fileBuffer = req.file.buffer;
    const imageUploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: req.file.originalname,
      tags: ['portfolio'],
    });

    const tempDir = './temp';
    const publicId = `${"portfolio"}_${Date.now()}`;
    const fileExtension = req.file.originalname.split('.').pop();
    const tempFilePath = path.join(tempDir, `${publicId}.${fileExtension}`); // Define the temporary file path

    // Create the temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Write buffer to the file
    fs.writeFileSync(tempFilePath, fileBuffer);
    //ImageKit


    //Cloudionary
    cloudinary.uploader.upload(tempFilePath,
      { public_id: publicId, overwrite: true },
      function (error, result) { console.log(result); }
    );
    // Extract image URL from ImageKit response
    const imageUrl = imageUploadResponse.url;


    const updatedPortfolioItem = await PortfolioModel.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl },
      { new: true }
    );
    if (!updatedPortfolioItem) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }
    res.json(updatedPortfolioItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a portfolio item
app.delete("/portfolio/:id", async (req, res) => {
  try {
    const deletedPortfolioItem = await PortfolioModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedPortfolioItem) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }
    res.json({ message: "Portfolio item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
