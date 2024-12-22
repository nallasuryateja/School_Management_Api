// const express = require("express");
// const Teacher = require("../models/Teacher");

// const router = express.Router();

// // Get all teachers
// router.get("/", async (req, res) => {
//   try {
//     const teachers = await Teacher.find().populate("assignedClass");
//     res.json(teachers);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create a new teacher
// router.post("/", async (req, res) => {
//   const teacher = new Teacher({
//     name: req.body.name,
//     gender: req.body.gender,
//     dob: req.body.dob,
//     contact: req.body.contact,
//     salary: req.body.salary,
//     assignedClass: req.body.assignedClass,
//   });

//   try {
//     const newTeacher = await teacher.save();
//     res.status(201).json(newTeacher);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const Teacher = require("../models/Teacher");

const router = express.Router();

// Get all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("assignedClass");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get teachers with pagination and filtering
// router.get("/search", async (req, res) => {
//   const { page = 1, limit = 10, gender, name } = req.query;
//   const filter = {};
//   if (gender) filter.gender = gender;
//   if (name) filter.name = new RegExp(name, "i"); // Case-insensitive name search

//   try {
//     const teachers = await Teacher.find(filter)
//       .populate("assignedClass")
//       .limit(Number(limit))
//       .skip((Number(page) - 1) * Number(limit));

//     const total = await Teacher.countDocuments(filter);

//     res.json({
//       data: teachers,
//       total,
//       totalPages: Math.ceil(total / limit),
//       currentPage: Number(page),
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.get("/search", async (req, res) => {
  const { page = 1, limit = 10, gender, name } = req.query;

  const filter = {};
  // if (gender) filter.gender = gender;
  if (gender) filter.gender = new RegExp(`^${gender}$`, "i");
  if (name) filter.name = new RegExp(name, "i"); // Case-insensitive name search

  // console.log("Generated filter:", filter); // Log the filter object

  try {
    const teachers = await Teacher.find(filter)
      .populate("assignedClass")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Teacher.countDocuments(filter);

    res.json({
      data: teachers,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    // console.error("Error fetching data:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Create a new teacher
router.post("/", async (req, res) => {
  const teacher = new Teacher({
    name: req.body.name,
    gender: req.body.gender,
    dob: req.body.dob,
    contact: req.body.contact,
    salary: req.body.salary,
    assignedClass: req.body.assignedClass,
  });

  try {
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing teacher
router.put("/:id", async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(updatedTeacher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a teacher
router.delete("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
