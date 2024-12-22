// const express = require("express");
// const Student = require("../models/Student");

// const router = express.Router();

// // Get all students
// router.get("/", async (req, res) => {
//   try {
//     const students = await Student.find().populate("class");
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create a new student
// router.post("/", async (req, res) => {
//   const student = new Student({
//     name: req.body.name,
//     gender: req.body.gender,
//     dob: req.body.dob,
//     contact: req.body.contact,
//     feesPaid: req.body.feesPaid,
//     class: req.body.class,
//   });

//   try {
//     const newStudent = await student.save();
//     res.status(201).json(newStudent);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate("class");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("class");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new student
router.post("/", async (req, res) => {
  const student = new Student({
    name: req.body.name,
    gender: req.body.gender,
    dob: req.body.dob,
    contact: req.body.contact,
    feesPaid: req.body.feesPaid,
    class: req.body.class,
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a student by ID
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update fields
    student.name = req.body.name || student.name;
    student.gender = req.body.gender || student.gender;
    student.dob = req.body.dob || student.dob;
    student.contact = req.body.contact || student.contact;
    student.feesPaid =
      req.body.feesPaid !== undefined ? req.body.feesPaid : student.feesPaid;
    student.class = req.body.class || student.class;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a student by ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     await student.remove();
//     res.json({ message: "Student deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get students with sorting, filtering, and pagination
router.get("/search", async (req, res) => {
  try {
    const {
      gender,
      feesPaid,
      class: classId,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = req.query;
    const filter = {};

    if (gender) filter.gender = gender;
    if (feesPaid !== undefined) filter.feesPaid = feesPaid === "true";
    if (classId) filter.class = classId;

    const sortOption = {};
    if (sortBy) {
      sortOption[sortBy] = order === "desc" ? -1 : 1;
    }

    const students = await Student.find(filter)
      .populate("class")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalStudents = await Student.countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / limit);

    res.json({
      students,
      totalPages,
      currentPage: parseInt(page),
      totalStudents,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
