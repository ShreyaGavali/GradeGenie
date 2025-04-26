const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const generatedAssignment = require("./routes/assignmentRoute.js");
const authRoutes = require('./routes/authRoute.js');
const courseRoutes = require('./routes/courseRoute.js');
const uploadRoutes = require('./routes/uploadRoute.js');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use("/api/assignments", generatedAssignment);
app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/upload", uploadRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
