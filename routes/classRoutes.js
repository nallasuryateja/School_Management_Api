// const express = require("express");
// const Class = require("../models/Class");

// const router = express.Router();

// // Get all classes
// router.get("/", async (req, res) => {
//   try {
//     const classes = await Class.find()
//       .populate("teacher")
//       .populate("studentList");
//     res.json(classes);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create a new class
// router.post("/", async (req, res) => {
//   const classObj = new Class({
//     name: req.body.name,
//     year: req.body.year,
//     teacher: req.body.teacher,
//     studentFees: req.body.studentFees,
//     studentList: req.body.studentList,
//   });

//   try {
//     const newClass = await classObj.save();
//     res.status(201).json(newClass);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const Class = require("../models/Class");

const router = express.Router();

// Get all classes
router.get("/", async (req, res) => {
  try {
    const query = req.query; // Handle query parameters if provided
    const classes = await Class.find(query)
      .populate("teacher")
      .populate("studentList");
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get classes with pagination and sorting
router.get("/paginate", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query;
    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 },
    };

    const classes = await Class.find()
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .populate("teacher")
      .populate("studentList");

    const total = await Class.countDocuments();
    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      classes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific class by ID
router.get("/:id", async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id)
      .populate("teacher")
      .populate("studentList");
    if (!classObj) return res.status(404).json({ message: "Class not found" });
    res.json(classObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new class
router.post("/", async (req, res) => {
  const classObj = new Class({
    name: req.body.name,
    year: req.body.year,
    teacher: req.body.teacher,
    studentFees: req.body.studentFees,
    studentList: req.body.studentList,
  });

  try {
    const newClass = await classObj.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a class by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        year: req.body.year,
        teacher: req.body.teacher,
        studentFees: req.body.studentFees,
        studentList: req.body.studentList,
      },
      { new: true, runValidators: true } // Return updated document and validate
    );
    if (!updatedClass)
      return res.status(404).json({ message: "Class not found" });
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a class by ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedClass = await Class.findByIdAndDelete(req.params.id);
//     if (!deletedClass)
//       return res.status(404).json({ message: "Class not found" });
//     res.json({ message: "Class deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.delete("/:id", async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
