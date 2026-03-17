require("dotenv").config();
const express = require("express");
const app = express();

const assignmentRoutes = require("./routes/assignments");

app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});


// Routes
app.use("/api/assignments", assignmentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Student Assignment Tracker API is running"
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

