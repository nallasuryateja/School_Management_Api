// app.js
const express = require("express");
const cors = require("cors"); // Import the cors middleware
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classRoutes");
const teacherRoutes = require("./routes/teacherRoutes");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json()); // for parsing application/json

// Enable CORS for all origins
app.use(cors());

// Alternatively, to restrict access to a specific origin:
// app.use(cors({ origin: "http://localhost:3001" }));

// API Routes
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/teachers", teacherRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// // app.js
// const express = require("express");
// const connectDB = require("./config/db");
// const studentRoutes = require("./routes/studentRoutes");
// const classRoutes = require("./routes/classRoutes");
// const teacherRoutes = require("./routes/teacherRoutes");
// const seedData = require("./utils/seeddata"); // Make sure this is the correct case

// const app = express();

// // Connect to database
// connectDB();

// // Middleware
// app.use(express.json()); // for parsing application/json

// // API Routes
// app.use("/api/students", studentRoutes);
// app.use("/api/classes", classRoutes);
// app.use("/api/teachers", teacherRoutes);

// // Run seed script
// seedData(); // Run the data seeding script

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
