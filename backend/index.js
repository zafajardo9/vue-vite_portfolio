import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ImageKit from 'imagekit';
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';
// Create an Express app
const app = express();
import multer from 'multer';

// Multer storage configuration
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

// Middleware to parse JSON bodies
app.use(express.json());

// Set the port from environment variables or default to 7000
const PORT = process.env.PORT || 7000;

// Get the MongoDB connection URL from environment variables
const MONGOURL = process.env.CONNECTION_STRING;



var imagekit = new ImageKit({
    publicKey : "public_Bb332HH34jVflMqkdCBBeMCmlSE=",
    privateKey : "private_N9Vnw5/36orITy9TnlVou6Pn7z4=",
    urlEndpoint : "https://ik.imagekit.io/23umzxu6uw"
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
    const fileBuffer = req.file.buffer;

    // Upload file to ImageKit
    const imageUploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: req.file.originalname, // Use the original file name for ImageKit
      tags: ['portfolio'], // Optional: Add tags for organization
    });

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
app.put("/portfolio/:id", async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
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
