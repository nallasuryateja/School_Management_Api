// // seeddata.js
// const mongoose = require("mongoose");
// const Class = require("../models/Class");
// const Student = require("../models/Student");
// const Teacher = require("../models/Teacher");

// const connectDB = require("../config/db");
// connectDB();

// const isValidDate = (date) => {
//   return date instanceof Date && !isNaN(date);
// };

// const seedData = async () => {
//   try {
//     // Clear existing data
//     await Class.deleteMany();
//     await Student.deleteMany();
//     await Teacher.deleteMany();

//     // Create teachers
//     const teacher1 = new Teacher({
//       name: "John Doe",
//       gender: "Male",
//       dob: new Date("1980-05-15"),
//       contact: "1234567890",
//       salary: 50000,
//     });
//     const teacher2 = new Teacher({
//       name: "Jane Smith",
//       gender: "Female",
//       dob: new Date("1985-11-22"),
//       contact: "0987654321",
//       salary: 45000,
//     });

//     // Save teachers
//     const savedTeacher1 = await teacher1.save();
//     const savedTeacher2 = await teacher2.save();

//     // Create classes
//     const class1 = new Class({
//       name: "Class 1",
//       year: 2024,
//       teacher: savedTeacher1._id,
//       studentFees: 100,
//       studentList: [],
//     });
//     const class2 = new Class({
//       name: "Class 2",
//       year: 2025,
//       teacher: savedTeacher2._id,
//       studentFees: 120,
//       studentList: [],
//     });

//     // Save classes
//     const savedClass1 = await class1.save();
//     const savedClass2 = await class2.save();

//     // Create students for class 1
//     for (let i = 0; i < 100; i++) {
//       const dob = new Date(`2008-01-${String(i + 1).padStart(2, "0")}`);
//       if (!isValidDate(dob)) {
//         console.error(`Invalid date for Student ${i + 1}:`, dob);
//         continue; // Skip this student if the date is invalid
//       }

//       const student = new Student({
//         name: `Student ${i + 1}`,
//         gender: i % 2 === 0 ? "Male" : "Female",
//         dob: dob,
//         contact: `111111111${i % 10}`,
//         feesPaid: i % 2 === 0,
//         class: savedClass1._id,
//       });

//       await student.save();
//       savedClass1.studentList.push(student._id);
//     }

//     // Create students for class 2
//     for (let i = 0; i < 100; i++) {
//       const dob = new Date(`2008-02-${String(i + 1).padStart(2, "0")}`);
//       if (i + 1 > 28 && !isValidDate(dob)) {
//         console.error(`Invalid date for Student ${i + 101}:`, dob);
//         continue; // Skip this student if the date is invalid
//       }

//       const student = new Student({
//         name: `Student ${i + 101}`,
//         gender: i % 2 === 0 ? "Male" : "Female",
//         dob: dob,
//         contact: `111111111${i % 10}`,
//         feesPaid: i % 2 === 0,
//         class: savedClass2._id,
//       });

//       await student.save();
//       savedClass2.studentList.push(student._id);
//     }

//     // Update classes with students
//     await savedClass1.save(); // Corrected line
//     await savedClass2.save();

//     console.log("Data seeding completed");
//   } catch (error) {
//     console.error("Error seeding data:", error);
//   } finally {
//     process.exit();
//   }
// };

// module.exports = seedData;

const mongoose = require("mongoose");
const Class = require("../models/Class");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const connectDB = require("../config/db");
connectDB();

const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

const seedData = async () => {
  try {
    // Clear existing data
    await Class.deleteMany();
    await Student.deleteMany();
    await Teacher.deleteMany();

    // Create teachers
    const teachers = [];
    for (let i = 0; i < 10; i++) {
      const teacher = new Teacher({
        name: `Teacher ${i + 1}`,
        gender: i % 2 === 0 ? "Male" : "Female",
        dob: new Date(`198${i}-01-15`),
        contact: `999999999${i}`,
        salary: 40000 + i * 1000,
      });
      teachers.push(await teacher.save());
    }

    // Create classes
    const classes = [];
    for (let i = 0; i < 30; i++) {
      const assignedTeacher = teachers[i % teachers.length];
      const classData = new Class({
        name: `Class ${i + 1}`,
        year: 2024 + Math.floor(i / 10),
        teacher: assignedTeacher._id,
        studentFees: 100 + i * 10,
        studentList: [],
      });
      classes.push(await classData.save());
      assignedTeacher.assignedClass = classData._id;
      await assignedTeacher.save();
    }

    // Create students for each class
    for (let i = 0; i < classes.length; i++) {
      const classData = classes[i];
      for (let j = 0; j < 60; j++) {
        const dob = new Date(
          `2008-01-${String((j % 28) + 1).padStart(2, "0")}`
        );
        if (!isValidDate(dob)) {
          console.error(
            `Invalid date for Student ${j + 1} in Class ${classData.name}:`,
            dob
          );
          continue; // Skip this student if the date is invalid
        }

        const student = new Student({
          name: `Student ${i * 60 + j + 1}`,
          gender: j % 2 === 0 ? "Male" : "Female",
          dob: dob,
          contact: `88888888${j % 10}`,
          feesPaid: j % 2 === 0,
          class: classData._id,
        });

        await student.save();
        classData.studentList.push(student._id);
      }
      await classData.save();
    }

    console.log("Data seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    process.exit();
  }
};

module.exports = seedData;
