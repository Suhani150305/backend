/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔗 MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/eduachieve")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// 🧪 Test API
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// 🔐 LOGIN API
app.post("/login", async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = await User.findOne({ username, password, role });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            role: user.role
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🎓 GET ALL STUDENTS
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Error fetching students" });
    }
});

// ▶ START SERVER
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});
// Get faculty
app.get("/faculty", async (req, res) => {
    res.json(await Faculty.find());
});

// Get students with filter
app.get("/students/filter", async (req, res) => {
    const { dept, sem } = req.query;
    const query = {};
    if (dept) query.dept = dept;
    if (sem) query.sem = sem;

    res.json(await Student.find(query));
});

// Allocate proctor
app.post("/allocate", async (req, res) => {
    const { studentId, facultyId } = req.body;

    await Student.findByIdAndUpdate(studentId, {
        proctorId: facultyId
    });

    res.json({ message: "Proctor allocated successfully" });
});*/

/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔗 MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/eduachieve")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// 🧪 Test API
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// 🔐 LOGIN API
app.post("/login", async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = await User.findOne({ username, password, role });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 👨‍🏫 GET ALL FACULTY
/*app.get("/faculty", async (req, res) => {
    try {
        const faculty = await Faculty.find();
        res.json(faculty);
    } catch (err) {
        res.status(500).json({ message: "Error fetching faculty" });
    }
});*/

// ================= FACULTY ROUTES =================

// GET all faculty
/*app.get("/faculty", async (req, res) => {
    try {
        const faculty = await Faculty.find();
        res.json(faculty);
    } catch (err) {
        res.status(500).json({ message: "Error fetching faculty" });
    }
});

// ADD faculty
app.post("/faculty", async (req, res) => {
    try {
        const { name, dept, isProctor } = req.body;

        const newFaculty = new Faculty({
            name,
            dept,
            isProctor: isProctor || false
        });

        await newFaculty.save();
        res.json({ message: "Faculty added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding faculty" });
    }
});

// DELETE faculty
app.delete("/faculty/:id", async (req, res) => {
    try {
        await Faculty.findByIdAndDelete(req.params.id);
        res.json({ message: "Faculty deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting faculty" });
    }
});


// 🎓 GET ALL STUDENTS
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Error fetching students" });
    }
});

// 🎓 GET STUDENTS WITH FILTER (dept / sem)
app.get("/students/filter", async (req, res) => {
    try {
        const { dept, sem } = req.query;
        const query = {};
        if (dept) query.dept = dept;
        if (sem) query.sem = sem;

        const students = await Student.find(query);
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: "Error filtering students" });
    }
});

// ➕ ADD STUDENT
app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, status } = req.body;

    if (!name || !rollNo || !sem || !dept) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await Student.findOne({ rollNo });
    if (existing) {
      return res.status(400).json({ message: "Roll No already exists" });
    }

    const student = new Student({
      name,
      rollNo,
      sem,
      dept,
      status
    });

    await student.save();
    res.json({ message: "Student added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add student" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});


// 🔗 ALLOCATE PROCTOR
app.post("/allocate", async (req, res) => {
    try {
        const { studentId, facultyId } = req.body;

        await Student.findByIdAndUpdate(studentId, {
            proctorId: facultyId
        });

        res.json({ message: "Proctor allocated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Allocation failed" });
    }
});
// ➕ ADD FACULTY
app.post("/faculty", async (req, res) => {
    try {
        const { name, dept, isProctor } = req.body;

        const faculty = new Faculty({
            name,
            dept,
            isProctor: isProctor || false
        });

        await faculty.save();
        res.json({ message: "Faculty added successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to add faculty" });
    }
});

// ▶ START SERVER (ALWAYS AT END)
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});*/

/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json());

// ================= DB CONNECTION =================
mongoose
  .connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ================= TEST API =================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const user = await User.findOne({ username, password, role });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= FACULTY =================

// GET all faculty
app.get("/faculty", async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: "Error fetching faculty" });
  }
});

// ADD faculty
// ADD faculty
app.post("/faculty", async (req, res) => {
  try {
    // We now expect a 'roles' object from the frontend
    const { name, dept, roles } = req.body;

    if (!name || !dept) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const faculty = new Faculty({
      name,
      dept,
      // Save the roles exactly as sent from frontend
      roles: roles || { proctor: false, hod: false, coordinator: false }
    });

    await faculty.save();
    res.json({ message: "Faculty added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding faculty" });
  }
});

// DELETE faculty
app.delete("/faculty/:id", async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting faculty" });
  }
});

// ================= STUDENTS =================

// GET all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

// GET students with filter
app.get("/students/filter", async (req, res) => {
  try {
    const { dept, sem } = req.query;
    const query = {};

    if (dept) query.dept = dept;
    if (sem) query.sem = sem;

    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error filtering students" });
  }
});

// ADD student  ✅ (THIS FIXED YOUR ISSUE)
app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, status } = req.body;

    if (!name || !rollNo || !sem || !dept) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await Student.findOne({ rollNo });
    if (existing) {
      return res.status(400).json({ message: "Roll No already exists" });
    }

    const student = new Student({
      name,
      rollNo,
      sem,
      dept,
      status
    });

    await student.save();
    res.json({ message: "Student added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add student" });
  }
});

// DELETE student
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// ================= ALLOCATION =================
app.post("/allocate", async (req, res) => {
  try {
    const { studentId, facultyId } = req.body;

    await Student.findByIdAndUpdate(studentId, {
      proctorId: facultyId
    });

    res.json({ message: "Proctor allocated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Allocation failed" });
  }
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});*/



/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json());

// ================= DB CONNECTION & FIX =================
mongoose
  .connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");

    // --- 🛠️ AUTO-FIX FOR DUPLICATE EMAIL ERROR ---
    try {
      // This forces MongoDB to delete the old "Unique Email" rule
      await mongoose.connection.collection("faculties").dropIndex("email_1");
      console.log("⚠️ FIX APPLIED: Old 'email' restriction removed.");
    } catch (e) {
      // If the rule is already gone, this is fine
      console.log("✅ Database rules are clean.");
    }
    // ------------------------------------------------
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= TEST API =================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= FACULTY ROUTES =================

// GET all faculty
app.get("/faculty", async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: "Error fetching faculty" });
  }
});

// ADD faculty
app.post("/faculty", async (req, res) => {
  try {
    console.log("📥 Adding Faculty:", req.body); 

    const { name, dept, roles } = req.body;

    if (!name || !dept) {
      return res.status(400).json({ message: "Missing Name or Dept" });
    }

    // Default roles if missing
    const safeRoles = roles || { proctor: false, hod: false, coordinator: false };

    const faculty = new Faculty({
      name,
      dept,
      roles: safeRoles
    });

    await faculty.save();
    console.log("✅ Faculty Saved Successfully!");
    res.json({ message: "Faculty added successfully" });

  } catch (err) {
    console.error("❌ ERROR SAVING FACULTY:", err); 
    res.status(500).json({ message: "Error adding faculty: " + err.message });
  }
});

// DELETE faculty
app.delete("/faculty/:id", async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting faculty" });
  }
});

// ================= STUDENT ROUTES =================

// GET all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

// ADD student
app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, status } = req.body;
    if (!name || !rollNo || !sem || !dept) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const existing = await Student.findOne({ rollNo });
    if (existing) return res.status(400).json({ message: "Roll No already exists" });

    const student = new Student({ name, rollNo, sem, dept, status });
    await student.save();
    res.json({ message: "Student added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add student" });
  }
});

// DELETE student
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// ================= ALLOCATION ROUTES =================
app.post("/allocate", async (req, res) => {
  try {
    const { studentId, facultyId } = req.body;
    await Student.findByIdAndUpdate(studentId, { proctorId: facultyId });
    res.json({ message: "Proctor allocated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Allocation failed" });
  }
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});*/

/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json());

// ================= DB CONNECTION & FIX =================
mongoose
  .connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try {
      await mongoose.connection.collection("faculties").dropIndex("email_1");
      console.log("⚠️ FIX APPLIED: Old 'email' restriction removed.");
    } catch (e) {
      console.log("✅ Database rules are clean.");
    }
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= TEST API =================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= FACULTY ROUTES =================
app.get("/faculty", async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: "Error fetching faculty" });
  }
});

app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, roles } = req.body;
    if (!name || !dept) return res.status(400).json({ message: "Missing Name or Dept" });

    const safeRoles = roles || { proctor: false, hod: false, coordinator: false };
    const faculty = new Faculty({ name, dept, roles: safeRoles });

    await faculty.save();
    res.json({ message: "Faculty added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding faculty: " + err.message });
  }
});

app.delete("/faculty/:id", async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting faculty" });
  }
});
// EDIT faculty
app.put("/faculty/:id", async (req, res) => {
  try {
    const { name, dept, roles } = req.body;
    await Faculty.findByIdAndUpdate(req.params.id, { name, dept, roles });
    res.json({ message: "Faculty updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating faculty" });
  }
});
// ================= STUDENT ROUTES =================
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, status } = req.body;
    if (!name || !rollNo || !sem || !dept) return res.status(400).json({ message: "Missing fields" });

    const existing = await Student.findOne({ rollNo });
    if (existing) return res.status(400).json({ message: "Roll No already exists" });

    const student = new Student({ name, rollNo, sem, dept, status });
    await student.save();
    res.json({ message: "Student added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add student" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// ================= ALLOCATION ROUTES =================
app.post("/allocate", async (req, res) => {
  try {
    const { studentId, facultyId } = req.body;
    await Student.findByIdAndUpdate(studentId, { proctorId: facultyId });
    res.json({ message: "Proctor allocated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Allocation failed" });
  }
});

// ================= SECURITY (RESET PASSWORD) =================
// This is the new feature you asked for
app.post("/reset-password", async (req, res) => {
    try {
        const { username, newPassword } = req.body;
        
        // Find user and update password
        const user = await User.findOneAndUpdate(
            { username: username },
            { password: newPassword }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating password" });
    }
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});*/

/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json());

// ================= DB CONNECTION =================
mongoose
  .connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try {
      await mongoose.connection.collection("faculties").dropIndex("email_1");
    } catch (e) {}
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= TEST API =================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= FACULTY ROUTES =================
app.get("/faculty", async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: "Error fetching faculty" });
  }
});

app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, roles } = req.body;
    if (!name || !dept) return res.status(400).json({ message: "Missing fields" });
    const safeRoles = roles || { proctor: false, hod: false, coordinator: false };
    const faculty = new Faculty({ name, dept, roles: safeRoles });
    await faculty.save();
    res.json({ message: "Faculty added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding faculty" });
  }
});

// EDIT FACULTY (If you need this too)
app.put("/faculty/:id", async (req, res) => {
  try {
    const { name, dept, roles } = req.body;
    await Faculty.findByIdAndUpdate(req.params.id, { name, dept, roles });
    res.json({ message: "Faculty updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating faculty" });
  }
});

app.delete("/faculty/:id", async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: "Faculty deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting faculty" });
  }
});

// ================= STUDENT ROUTES =================
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, status } = req.body;
    if (!name || !rollNo) return res.status(400).json({ message: "Missing fields" });
    const student = new Student({ name, rollNo, sem, dept, status });
    await student.save();
    res.json({ message: "Student added" });
  } catch (err) {
    res.status(500).json({ message: "Error adding student" });
  }
});

// 🔴 THIS WAS MISSING: EDIT STUDENT ROUTE
app.put("/students/:id", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, status } = req.body;
    
    // Find the student by ID and update their details
    await Student.findByIdAndUpdate(req.params.id, { 
      name, 
      rollNo, 
      sem, 
      dept, 
      status 
    });

    res.json({ message: "Student updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating student" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// ================= ALLOCATION & SECURITY =================
app.post("/allocate", async (req, res) => {
  try {
    const { studentId, facultyId } = req.body;
    await Student.findByIdAndUpdate(studentId, { proctorId: facultyId });
    res.json({ message: "Proctor allocated" });
  } catch (err) {
    res.status(500).json({ message: "Allocation failed" });
  }
});

app.post("/reset-password", async (req, res) => {
    try {
        const { username, newPassword } = req.body;
        const user = await User.findOneAndUpdate({ username }, { password: newPassword });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Password updated" });
    } catch (err) {
        res.status(500).json({ message: "Error updating password" });
    }
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});*/


/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
// Increased limit to handle large CSV files
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); 

// ================= DB CONNECTION =================
mongoose.connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) {}
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= TEST API =================
app.get("/", (req, res) => res.send("Backend is running"));

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= FACULTY ROUTES =================
app.get("/faculty", async (req, res) => {
  try { res.json(await Faculty.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, roles } = req.body;
    if (!name || !dept) return res.status(400).json({ message: "Missing fields" });
    const safeRoles = roles || { proctor: false, hod: false, coordinator: false };
    const faculty = new Faculty({ name, dept, roles: safeRoles });
    await faculty.save();
    res.json({ message: "Added" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.put("/faculty/:id", async (req, res) => {
  try {
    await Faculty.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Updated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.delete("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= STUDENT ROUTES =================
app.get("/students", async (req, res) => {
  try { res.json(await Student.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

// SINGLE ADD
app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, status } = req.body;
    if (await Student.findOne({ rollNo })) return res.status(400).json({ message: "Roll No exists" });
    const student = new Student({ name, rollNo, sem, dept, status });
    await student.save();
    res.json({ message: "Student added" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// 🚀 BULK UPLOAD (NEW FEATURE)
app.post("/students/bulk", async (req, res) => {
    try {
        const students = req.body; // Array of students
        let added = 0;
        let skipped = 0;

        for (const s of students) {
            // Check if Roll No already exists
            const exists = await Student.findOne({ rollNo: s.rollNo });
            if (!exists && s.name && s.rollNo) {
                // Default status if missing
                const newStudent = new Student({
                    name: s.name,
                    rollNo: s.rollNo,
                    sem: s.sem || "1",
                    dept: s.dept || "Gen",
                    status: "Enrolled"
                });
                await newStudent.save();
                added++;
            } else {
                skipped++;
            }
        }
        res.json({ message: `Upload Complete: ${added} added, ${skipped} skipped (duplicates/invalid).` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Bulk upload failed" });
    }
});

// UPDATE
app.put("/students/:id", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// DELETE
app.delete("/students/:id", async (req, res) => {
  try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= ALLOCATION & SECURITY =================
app.post("/allocate", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId });
    res.json({ message: "Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/reset-password", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ username: req.body.username }, { password: req.body.newPassword });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Password updated" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));*/


/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); 

// ================= DB CONNECTION =================
mongoose.connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) {}
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= TEST API =================
app.get("/", (req, res) => res.send("Backend is running"));

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= FACULTY ROUTES =================
app.get("/faculty", async (req, res) => {
  try { res.json(await Faculty.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, roles } = req.body;
    if (!name || !dept) return res.status(400).json({ message: "Missing fields" });
    const safeRoles = roles || { proctor: false, hod: false, coordinator: false };
    const faculty = new Faculty({ name, dept, roles: safeRoles });
    await faculty.save();
    res.json({ message: "Added" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.put("/faculty/:id", async (req, res) => {
  try {
    await Faculty.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Updated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.delete("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= STUDENT ROUTES =================
app.get("/students", async (req, res) => {
  try { res.json(await Student.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, status } = req.body;
    if (await Student.findOne({ rollNo })) return res.status(400).json({ message: "Roll No exists" });
    const student = new Student({ name, rollNo, sem, dept, status });
    await student.save();
    res.json({ message: "Student added" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/students/bulk", async (req, res) => {
    try {
        const students = req.body; 
        let added = 0;
        for (const s of students) {
            const exists = await Student.findOne({ rollNo: s.rollNo });
            if (!exists && s.name && s.rollNo) {
                const newStudent = new Student({
                    name: s.name,
                    rollNo: s.rollNo,
                    sem: s.sem || "1",
                    dept: s.dept || "Gen",
                    status: "Enrolled"
                });
                await newStudent.save();
                added++;
            }
        }
        res.json({ message: `Upload Complete: ${added} added.` });
    } catch (err) { res.status(500).json({ message: "Bulk upload failed" }); }
});

app.put("/students/:id", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

app.delete("/students/:id", async (req, res) => {
  try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= ALLOCATION ROUTES =================

// 1. Single Allocate (Legacy/Specific)
app.post("/allocate", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId });
    res.json({ message: "Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// 2. CLASS ALLOCATE (New Feature)
app.post("/allocate/class", async (req, res) => {
  try {
    const { dept, sem, facultyId } = req.body;
    
    // Find all students matching Dept & Sem and update their proctor
    const result = await Student.updateMany(
        { dept: dept, sem: sem },
        { $set: { proctorId: facultyId } }
    );
    
    res.json({ message: `Successfully assigned proctor to ${result.modifiedCount} students.` });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ message: "Class allocation failed" }); 
  }
});

app.post("/reset-password", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ username: req.body.username }, { password: req.body.newPassword });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Password updated" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));*/


/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const { User, Student, Faculty } = require("./model");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); 

mongoose.connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) {}
  })
  .catch(err => console.log("❌ DB Error:", err));

app.get("/", (req, res) => res.send("Backend is running"));

// ================= LOGIN & USERS =================

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// FORGOT PASSWORD (SELF SERVICE)
app.post("/forgot-password", async (req, res) => {
    try {
        const { username, newPassword } = req.body;
        // Simple verification: Just checking if user exists for this demo
        const user = await User.findOneAndUpdate({ username }, { password: newPassword });
        
        if (!user) return res.status(404).json({ message: "Username not found in system." });
        res.json({ message: "Password reset successful! You can now login." });
    } catch (err) { res.status(500).json({ message: "Error resetting password" }); }
});

// GET ALL CREDENTIALS (FOR ADMIN SECURITY TAB)
app.get("/users", async (req, res) => {
    try { res.json(await User.find()); } 
    catch (err) { res.status(500).json({ message: "Error fetching users" }); }
});

// ================= FACULTY ROUTES =================
app.get("/faculty", async (req, res) => {
  try { res.json(await Faculty.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, roles } = req.body;
    if (!name || !dept) return res.status(400).json({ message: "Missing fields" });
    
    // 1. Save Faculty Profile
    const safeRoles = roles || { proctor: false, hod: false, coordinator: false };
    const faculty = new Faculty({ name, dept, roles: safeRoles });
    await faculty.save();

    // 2. AUTO-CREATE LOGIN USER (Username: Name (no spaces), Password: 123456)
    const username = name.replace(/\s+/g, '').toLowerCase();
    const existingUser = await User.findOne({ username });
    if(!existingUser) {
        await new User({ username, password: "123456", role: "faculty" }).save();
    }

    res.json({ message: "Added (Default Login: " + username + " / 123456)" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.put("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

app.delete("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= STUDENT ROUTES =================
app.get("/students", async (req, res) => {
  try { res.json(await Student.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, status } = req.body;
    if (await Student.findOne({ rollNo })) return res.status(400).json({ message: "Roll No exists" });
    
    // 1. Save Student Profile
    const student = new Student({ name, rollNo, sem, dept, status });
    await student.save();

    // 2. AUTO-CREATE LOGIN USER (Username: RollNo, Password: 123456)
    const existingUser = await User.findOne({ username: rollNo });
    if(!existingUser) {
        await new User({ username: rollNo, password: "123456", role: "student" }).save();
    }

    res.json({ message: "Student added (Default Pwd: 123456)" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// BULK UPLOAD (NOW CREATES USERS TOO)
app.post("/students/bulk", async (req, res) => {
    try {
        const students = req.body; 
        let added = 0;
        for (const s of students) {
            const exists = await Student.findOne({ rollNo: s.rollNo });
            if (!exists && s.name && s.rollNo) {
                // Save Student
                await new Student({
                    name: s.name,
                    rollNo: s.rollNo,
                    sem: s.sem || "1",
                    dept: s.dept || "Gen",
                    status: "Enrolled"
                }).save();

                // Create Login User
                const userExists = await User.findOne({ username: s.rollNo });
                if(!userExists) {
                    await new User({ username: s.rollNo, password: "123456", role: "student" }).save();
                }
                added++;
            }
        }
        res.json({ message: `Upload Complete: ${added} students (and login accounts) created.` });
    } catch (err) { res.status(500).json({ message: "Bulk upload failed" }); }
});

app.put("/students/:id", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

app.delete("/students/:id", async (req, res) => {
  try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= ALLOCATION ROUTES =================
app.post("/allocate", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId });
    res.json({ message: "Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/allocate/class", async (req, res) => {
  try {
    const { dept, sem, facultyId } = req.body;
    await Student.updateMany({ dept: dept, sem: sem }, { $set: { proctorId: facultyId } });
    res.json({ message: "Class Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ADMIN RESET PASSWORD (OVERRIDE)
app.post("/reset-password", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ username: req.body.username }, { password: req.body.newPassword });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Password updated" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));*/


/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const { User, Student, Faculty } = require("./model");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// OTP Storage (In-Memory)
const otpStore = new Map(); // Stores { username: otp }

mongoose.connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) {}
  })
  .catch(err => console.log("❌ DB Error:", err));

app.get("/", (req, res) => res.send("Backend is running"));

// ================= LOGIN & AUTH =================
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// 1. GENERATE OTP
app.post("/send-otp", async (req, res) => {
    try {
        const { username, email } = req.body;
        
        // Check if user exists and email matches
        const user = await User.findOne({ username, email });
        if (!user) {
            return res.status(404).json({ message: "Username and Email do not match our records." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP (valid for 5 mins)
        otpStore.set(username, otp);
        setTimeout(() => otpStore.delete(username), 5 * 60 * 1000);

        // LOG TO CONSOLE (Since we don't have a real email server configured)
        console.log(`========================================`);
        console.log(`🔐 OTP for ${username} (${email}): ${otp}`);
        console.log(`========================================`);

        res.json({ message: "OTP sent to your email (Check Server Console)" });
    } catch (err) {
        res.status(500).json({ message: "Error sending OTP" });
    }
});

// 2. VERIFY OTP & RESET PASSWORD
app.post("/verify-reset-password", async (req, res) => {
    try {
        const { username, otp, newPassword } = req.body;

        // Check OTP
        if (otpStore.get(username) !== otp) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        // Update Password
        await User.findOneAndUpdate({ username }, { password: newPassword });
        otpStore.delete(username); // Clear OTP

        res.json({ message: "Password reset successful! Please Login." });
    } catch (err) {
        res.status(500).json({ message: "Error resetting password" });
    }
});

// ================= FACULTY ROUTES =================
app.get("/faculty", async (req, res) => {
  try { res.json(await Faculty.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, email, roles } = req.body; // Added email
    if (!name || !dept) return res.status(400).json({ message: "Missing fields" });
    
    const safeRoles = roles || { proctor: false, hod: false, coordinator: false };
    await new Faculty({ name, dept, email, roles: safeRoles }).save();

    // Auto-create Login
    const username = name.replace(/\s+/g, '').toLowerCase();
    const safeEmail = email || `${username}@edu.com`; // Default if missing
    if(!(await User.findOne({ username }))) {
        await new User({ username, email: safeEmail, password: "123456", role: "faculty" }).save();
    }

    res.json({ message: "Added" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.put("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

app.delete("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= STUDENT ROUTES =================
app.get("/students", async (req, res) => {
  try { res.json(await Student.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, email, status } = req.body; // Added email
    if (await Student.findOne({ rollNo })) return res.status(400).json({ message: "Roll No exists" });
    
    await new Student({ name, rollNo, sem, dept, email, status }).save();

    // Auto-create Login
    const safeEmail = email || `${rollNo}@student.edu`;
    if(!(await User.findOne({ username: rollNo }))) {
        await new User({ username: rollNo, email: safeEmail, password: "123456", role: "student" }).save();
    }

    res.json({ message: "Student added" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/students/bulk", async (req, res) => {
    try {
        const students = req.body; 
        let added = 0;
        for (const s of students) {
            const exists = await Student.findOne({ rollNo: s.rollNo });
            if (!exists && s.name && s.rollNo) {
                // Determine Email from CSV or generate fake one
                const email = s.email || `${s.rollNo}@student.edu`;

                await new Student({
                    name: s.name, rollNo: s.rollNo, sem: s.sem || "1", dept: s.dept || "Gen", email: email, status: "Enrolled"
                }).save();

                if(!(await User.findOne({ username: s.rollNo }))) {
                    await new User({ username: s.rollNo, email: email, password: "123456", role: "student" }).save();
                }
                added++;
            }
        }
        res.json({ message: `Upload Complete: ${added} added.` });
    } catch (err) { res.status(500).json({ message: "Bulk upload failed" }); }
});

app.put("/students/:id", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

app.delete("/students/:id", async (req, res) => {
  try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= ALLOCATION & ADMIN SECURITY =================
app.post("/allocate", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId });
    res.json({ message: "Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/allocate/class", async (req, res) => {
  try {
    const { dept, sem, facultyId } = req.body;
    await Student.updateMany({ dept: dept, sem: sem }, { $set: { proctorId: facultyId } });
    res.json({ message: "Class Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// Admin Override Route (No OTP needed)
app.post("/reset-password", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ username: req.body.username }, { password: req.body.newPassword });
        res.json({ message: "Password updated" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// Get Users for Admin
app.get("/users", async (req, res) => {
    try { res.json(await User.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));*/



/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer"); // Import Nodemailer

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); 

// ================= DB CONNECTION =================
mongoose
  .connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) {}
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= 📧 EMAIL CONFIGURATION (GMAIL) =================
// REPLACE THESE WITH YOUR REAL DETAILS
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com', // 🔴 PUT YOUR GMAIL HERE
    pass: 'YOUR_APP_PASSWORD'     // 🔴 PUT YOUR 16-DIGIT APP PASSWORD HERE
  }
});

// OTP Storage (Temporary In-Memory)
const otpStore = new Map();

// ================= TEST API =================
app.get("/", (req, res) => res.send("Backend is running"));

// ================= AUTHENTICATION ROUTES =================

// 1. LOGIN
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 2. SEND OTP (UPDATED TO SEND REAL EMAIL)
app.post("/send-otp", async (req, res) => {
    try {
        const { username, email } = req.body;
        
        // Verify User Exists
        const user = await User.findOne({ username, email });
        if (!user) return res.status(404).json({ message: "Username and Email do not match." });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(username, otp);
        
        // Auto-expire in 5 mins
        setTimeout(() => otpStore.delete(username), 5 * 60 * 1000);

        // --- SEND EMAIL ---
        const mailOptions = {
            from: '"EduAchieve Security" <no-reply@eduachieve.com>',
            to: email,
            subject: 'Password Reset OTP',
            text: `Hello,\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 5 minutes.\n\nRegards,\nEduAchieve Team`
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email}`);

        res.json({ message: `OTP sent to ${email}. Please check your inbox.` });
    } catch (err) {
        console.error("Email Error:", err);
        res.status(500).json({ message: "Failed to send email. Check server logs." });
    }
});

// 3. VERIFY OTP & RESET PASSWORD
app.post("/verify-reset-password", async (req, res) => {
    try {
        const { username, otp, newPassword } = req.body;

        if (otpStore.get(username) !== otp) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        await User.findOneAndUpdate({ username }, { password: newPassword });
        otpStore.delete(username); // Clear OTP after use

        res.json({ message: "Password reset successful!" });
    } catch (err) {
        res.status(500).json({ message: "Error resetting password" });
    }
});

// ================= ADMIN USER MANAGEMENT =================

app.get("/users", async (req, res) => {
    try { res.json(await User.find()); } 
    catch (err) { res.status(500).json({ message: "Error fetching users" }); }
});

app.post("/admin/update-user", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const updateData = {};
        if (email) updateData.email = email;
        if (password) updateData.password = password;

        const user = await User.findOneAndUpdate({ username }, updateData, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.json({ message: "User credentials updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating user" });
    }
});

app.post("/reset-password", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ username: req.body.username }, { password: req.body.newPassword });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Password updated" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= FACULTY ROUTES =================
app.get("/faculty", async (req, res) => {
  try { res.json(await Faculty.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, email, roles } = req.body;
    if (!name || !dept) return res.status(400).json({ message: "Missing Name or Dept" });
    
    const safeRoles = roles || { proctor: false, hod: false, coordinator: false };
    await new Faculty({ name, dept, email, roles: safeRoles }).save();

    const username = name.replace(/\s+/g, '').toLowerCase();
    const safeEmail = email || ""; // Allow empty email, Admin can fix later
    
    if(!(await User.findOne({ username }))) {
        await new User({ username, email: safeEmail, password: "123456", role: "faculty" }).save();
    }

    res.json({ message: "Faculty Added (Login Created)" });
  } catch (err) { res.status(500).json({ message: "Error adding faculty" }); }
});

app.put("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

app.delete("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= STUDENT ROUTES =================
app.get("/students", async (req, res) => {
  try { res.json(await Student.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, email, status } = req.body;
    if (await Student.findOne({ rollNo })) return res.status(400).json({ message: "Roll No exists" });
    
    await new Student({ name, rollNo, sem, dept, email, status }).save();

    const safeEmail = email || ""; 
    if(!(await User.findOne({ username: rollNo }))) {
        await new User({ username: rollNo, email: safeEmail, password: "123456", role: "student" }).save();
    }

    res.json({ message: "Student Added" });
  } catch (err) { res.status(500).json({ message: "Error adding student" }); }
});

app.post("/students/bulk", async (req, res) => {
    try {
        const students = req.body; 
        let added = 0;
        for (const s of students) {
            if (!await Student.findOne({ rollNo: s.rollNo }) && s.name && s.rollNo) {
                const email = s.email || "";
                
                await new Student({
                    name: s.name, rollNo: s.rollNo, sem: s.sem || "1", 
                    dept: s.dept || "Gen", email: email, status: "Enrolled"
                }).save();

                if(!(await User.findOne({ username: s.rollNo }))) {
                    await new User({ username: s.rollNo, email: email, password: "123456", role: "student" }).save();
                }
                added++;
            }
        }
        res.json({ message: `Bulk Upload: ${added} added.` });
    } catch (err) { res.status(500).json({ message: "Bulk upload failed" }); }
});

app.put("/students/:id", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

app.delete("/students/:id", async (req, res) => {
  try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= ALLOCATION ROUTES =================
app.post("/allocate", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId });
    res.json({ message: "Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/allocate/class", async (req, res) => {
  try {
    const { dept, sem, facultyId } = req.body;
    await Student.updateMany({ dept: dept, sem: sem }, { $set: { proctorId: facultyId } });
    res.json({ message: "Class Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});*/



/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path"); // <--- IMPORT THIS

const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); 

// 👇👇👇 THIS IS THE MAGIC LINE TO FIX YOUR ISSUE 👇👇👇
// This tells the server: "If someone asks for a file, look in the current folder"
app.use(express.static(__dirname)); 
// 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆

// ================= DB CONNECTION =================
mongoose
  .connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) {}
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= 📧 EMAIL CONFIGURATION =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_REAL_EMAIL@gmail.com',  // <--- Put your GMAIL here
    pass: 'YOUR_APP_PASSWORD'           // <--- Put your APP PASSWORD here
  }
});

// OTP Storage
const otpStore = new Map();

// ================= TEST API =================
app.get("/", (req, res) => {
    // Instead of sending text, we send the login page if they go to homepage
    res.sendFile(path.join(__dirname, 'login.html'));
});

// ================= AUTHENTICATION ROUTES =================
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

app.post("/send-otp", async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findOne({ username, email });
        if (!user) return res.status(404).json({ message: "Username and Email do not match." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(username, otp);
        setTimeout(() => otpStore.delete(username), 5 * 60 * 1000);

        const mailOptions = {
            from: '"EduAchieve Security" <no-reply@eduachieve.com>',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${email}`);
        res.json({ message: `OTP sent to ${email}.` });
    } catch (err) {
        console.error(err);
        // If email fails, fallback to console for testing
        console.log(`⚠️ FALLBACK OTP: ${otpStore.get(username)}`); 
        res.status(500).json({ message: "Email failed (Check Console for Fallback)" });
    }
});

app.post("/verify-reset-password", async (req, res) => {
    try {
        const { username, otp, newPassword } = req.body;
        if (otpStore.get(username) !== otp) return res.status(400).json({ message: "Invalid OTP" });
        await User.findOneAndUpdate({ username }, { password: newPassword });
        otpStore.delete(username);
        res.json({ message: "Password reset successful!" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= ADMIN & USER ROUTES =================
app.get("/users", async (req, res) => {
    try { res.json(await User.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/admin/update-user", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const updateData = {};
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        const user = await User.findOneAndUpdate({ username }, updateData, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Updated successfully" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= STUDENT & FACULTY ROUTES =================
app.get("/faculty", async (req, res) => {
  try { res.json(await Faculty.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, email, roles } = req.body;
    if (!name || !dept) return res.status(400).json({ message: "Missing Name/Dept" });
    const safeRoles = roles || { proctor: false, hod: false, coordinator: false };
    await new Faculty({ name, dept, email, roles: safeRoles }).save();
    
    const username = name.replace(/\s+/g, '').toLowerCase();
    const safeEmail = email || "";
    if(!(await User.findOne({ username }))) {
        await new User({ username, email: safeEmail, password: "123456", role: "faculty" }).save();
    }
    res.json({ message: "Added" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.put("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) {}
});
app.delete("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) {}
});

app.get("/students", async (req, res) => {
  try { res.json(await Student.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, email, status } = req.body;
    if (await Student.findOne({ rollNo })) return res.status(400).json({ message: "Roll No exists" });
    await new Student({ name, rollNo, sem, dept, email, status }).save();
    
    const safeEmail = email || "";
    if(!(await User.findOne({ username: rollNo }))) {
        await new User({ username: rollNo, email: safeEmail, password: "123456", role: "student" }).save();
    }
    res.json({ message: "Added" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/students/bulk", async (req, res) => {
    try {
        const students = req.body; 
        let added = 0;
        for (const s of students) {
            if (!await Student.findOne({ rollNo: s.rollNo }) && s.name && s.rollNo) {
                const email = s.email || "";
                await new Student({ name: s.name, rollNo: s.rollNo, sem: s.sem || "1", dept: s.dept || "Gen", email: email, status: "Enrolled" }).save();
                if(!(await User.findOne({ username: s.rollNo }))) {
                    await new User({ username: s.rollNo, email: email, password: "123456", role: "student" }).save();
                }
                added++;
            }
        }
        res.json({ message: `Bulk Upload: ${added} added.` });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.put("/students/:id", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) {}
});
app.delete("/students/:id", async (req, res) => {
  try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) {}
});

// ================= ALLOCATION =================
app.post("/allocate", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId });
    res.json({ message: "Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/allocate/class", async (req, res) => {
  try {
    const { dept, sem, facultyId } = req.body;
    await Student.updateMany({ dept: dept, sem: sem }, { $set: { proctorId: facultyId } });
    res.json({ message: "Class Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
  console.log("👉 Open your website here: http://localhost:5000/login.html");
});*/




/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path"); // Required to serve HTML files

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); 

// 👇👇👇 CRITICAL FIX: SERVE FRONTEND FILES 👇👇👇
// This line makes your HTML/CSS files accessible on Port 5000
app.use(express.static(__dirname)); 
// 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆

// ================= DB CONNECTION =================
mongoose
  .connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");
    // Auto-fix for any old index issues
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) {}
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= 📧 EMAIL CONFIGURATION =================
// 👇👇👇 EDIT THIS SECTION WITH YOUR REAL GMAIL 👇👇👇
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com',   // <--- REPLACE THIS
    pass: 'YOUR_APP_PASSWORD'       // <--- REPLACE THIS (16 chars from Google)
  }
});
// 👆👆👆 END EDIT SECTION 👆👆👆

// OTP Storage (Temporary In-Memory)
const otpStore = new Map();

// ================= ROOT ROUTE =================
// This opens login.html automatically when you go to http://localhost:5000
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// ================= AUTHENTICATION ROUTES =================

// 1. LOGIN
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 2. SEND OTP
app.post("/send-otp", async (req, res) => {
    try {
        const { username, email } = req.body;
        
        const user = await User.findOne({ username, email });
        if (!user) return res.status(404).json({ message: "Username and Email do not match." });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(username, otp);
        setTimeout(() => otpStore.delete(username), 5 * 60 * 1000); // 5 mins expiry

        const mailOptions = {
            from: '"EduAchieve Security" <no-reply@eduachieve.com>',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is: ${otp}`
        };

        // Try to send email
        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to ${email}`);
            res.json({ message: `OTP sent to ${email}.` });
        } catch (emailErr) {
            console.error("Email failed:", emailErr);
            console.log(`⚠️ FALLBACK OTP (For Testing): ${otp}`);
            res.json({ message: "Email failed to send. Check Server Console for OTP (Testing Mode)." });
        }

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// 3. VERIFY OTP
app.post("/verify-reset-password", async (req, res) => {
    try {
        const { username, otp, newPassword } = req.body;

        if (otpStore.get(username) !== otp) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        await User.findOneAndUpdate({ username }, { password: newPassword });
        otpStore.delete(username);

        res.json({ message: "Password reset successful!" });
    } catch (err) {
        res.status(500).json({ message: "Error resetting password" });
    }
});

// ================= ADMIN & USER MANAGEMENT =================

app.get("/users", async (req, res) => {
    try { res.json(await User.find()); } 
    catch (err) { res.status(500).json({ message: "Error fetching users" }); }
});

app.post("/admin/update-user", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const updateData = {};
        if (email) updateData.email = email;
        if (password) updateData.password = password;

        const user = await User.findOneAndUpdate({ username }, updateData, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating user" });
    }
});

app.post("/reset-password", async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ username: req.body.username }, { password: req.body.newPassword });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Password updated" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= FACULTY ROUTES =================
app.get("/faculty", async (req, res) => {
  try { res.json(await Faculty.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, email, roles } = req.body;
    if (!name || !dept) return res.status(400).json({ message: "Missing Name/Dept" });
    
    const safeRoles = roles || { proctor: false, hod: false, coordinator: false };
    await new Faculty({ name, dept, email, roles: safeRoles }).save();

    // Create Login
    const username = name.replace(/\s+/g, '').toLowerCase();
    const safeEmail = email || "";
    if(!(await User.findOne({ username }))) {
        await new User({ username, email: safeEmail, password: "123456", role: "faculty" }).save();
    }

    res.json({ message: "Faculty Added" });
  } catch (err) { res.status(500).json({ message: "Error adding faculty" }); }
});

app.put("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

app.delete("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= STUDENT ROUTES =================
app.get("/students", async (req, res) => {
  try { res.json(await Student.find()); } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, email, status } = req.body;
    if (await Student.findOne({ rollNo })) return res.status(400).json({ message: "Roll No exists" });
    
    await new Student({ name, rollNo, sem, dept, email, status }).save();

    // Create Login
    const safeEmail = email || "";
    if(!(await User.findOne({ username: rollNo }))) {
        await new User({ username: rollNo, email: safeEmail, password: "123456", role: "student" }).save();
    }

    res.json({ message: "Student Added" });
  } catch (err) { res.status(500).json({ message: "Error adding student" }); }
});

// BULK UPLOAD + LOGIN CREATION
app.post("/students/bulk", async (req, res) => {
    try {
        const students = req.body; 
        let added = 0;
        for (const s of students) {
            if (!await Student.findOne({ rollNo: s.rollNo }) && s.name && s.rollNo) {
                const email = s.email || "";
                
                await new Student({
                    name: s.name, rollNo: s.rollNo, sem: s.sem || "1", 
                    dept: s.dept || "Gen", email: email, status: "Enrolled"
                }).save();

                if(!(await User.findOne({ username: s.rollNo }))) {
                    await new User({ username: s.rollNo, email: email, password: "123456", role: "student" }).save();
                }
                added++;
            }
        }
        res.json({ message: `Bulk Upload: ${added} added.` });
    } catch (err) { res.status(500).json({ message: "Bulk upload failed" }); }
});

app.put("/students/:id", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

app.delete("/students/:id", async (req, res) => {
  try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } 
  catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= ALLOCATION ROUTES =================
app.post("/allocate", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId });
    res.json({ message: "Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.post("/allocate/class", async (req, res) => {
  try {
    const { dept, sem, facultyId } = req.body;
    await Student.updateMany({ dept: dept, sem: sem }, { $set: { proctorId: facultyId } });
    res.json({ message: "Class Allocated" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
  console.log("👉 Open Website: http://localhost:5000");
});*/



/*
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// 👇 SERVES YOUR HTML FILES ON PORT 5000 👇
app.use(express.static(__dirname));

// ================= DB CONNECTION =================
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eduachieve";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) { }

    // 👇 AUTO-CREATE ADMIN USER IF MISSING 👇
    const admin = await User.findOne({ username: "admin" });
    if (!admin) {
      await new User({
        username: "admin",
        email: "admin@edu.com", // You can edit this later in the dashboard
        password: "admin",      // Default password
        role: "admin"
      }).save();
      console.log("👑 Admin Account Created: username='admin', password='admin'");
    }
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= 📧 EMAIL CONFIGURATION =================
// 👇👇👇 YOU MUST EDIT THIS PART OR EMAIL WILL NOT WORK 👇👇👇
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // 1. PUT YOUR REAL GMAIL ADDRESS HERE:
    user: 'YOUR_REAL_EMAIL@gmail.com',

    // 2. PUT YOUR 16-DIGIT APP PASSWORD HERE:
    pass: 'xxxx xxxx xxxx xxxx'
  }
});
// 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆

// OTP Storage
const otpStore = new Map();

// ================= ROUTES =================

// Auto-open Login Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// 1. LOGIN
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// 2. SEND OTP (EMAIL)
app.post("/send-otp", async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findOne({ username, email });

    if (!user) return res.status(404).json({ message: "Username and Email do not match." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(username, otp);
    setTimeout(() => otpStore.delete(username), 5 * 60 * 1000);

    const mailOptions = {
      from: '"EduAchieve Security" <no-reply@eduachieve.com>',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is: ${otp}`
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
    res.json({ message: `OTP sent to ${email}. Check your Inbox.` });

  } catch (err) {
    console.error("Email Failed:", err);
    // Fallback if email fails
    console.log(`⚠️ FALLBACK OTP: ${otpStore.get(req.body.username)}`);
    res.status(500).json({ message: "Email failed. Check console for OTP." });
  }
});

// 3. VERIFY OTP
app.post("/verify-reset-password", async (req, res) => {
  try {
    const { username, otp, newPassword } = req.body;
    if (otpStore.get(username) !== otp) return res.status(400).json({ message: "Invalid OTP" });

    await User.findOneAndUpdate({ username }, { password: newPassword });
    otpStore.delete(username);
    res.json({ message: "Password reset successful!" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ADMIN ROUTES
app.get("/users", async (req, res) => {
  try { res.json(await User.find()); } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.post("/admin/update-user", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const update = {};
    if (email) update.email = email;
    if (password) update.password = password;

    // Ensure email is saved to User model
    await User.findOneAndUpdate({ username }, update);

    // Also try to update the Student/Faculty profile if it matches
    await Student.findOneAndUpdate({ rollNo: username }, { email: email });

    // For faculty (matching name roughly to username is hard, so we skip auto-sync for now)

    res.json({ message: "Updated successfully" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});

// FACULTY ROUTES
app.get("/faculty", async (req, res) => {
  try { res.json(await Faculty.find()); } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, email, roles } = req.body;
    await new Faculty({ name, dept, email, roles }).save();

    // Create Login
    const username = name.replace(/\s+/g, '').toLowerCase();
    const safeEmail = email || "";
    if (!(await User.findOne({ username }))) {
      await new User({ username, email: safeEmail, password: "123456", role: "faculty" }).save();
    }
    res.json({ message: "Added" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.put("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) { }
});
app.delete("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { }
});

// STUDENT ROUTES
app.get("/students", async (req, res) => {
  try { res.json(await Student.find()); } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, email, status } = req.body;
    if (await Student.findOne({ rollNo })) return res.status(400).json({ message: "Exists" });
    await new Student({ name, rollNo, sem, dept, email, status }).save();

    // Create Login
    const safeEmail = email || "";
    if (!(await User.findOne({ username: rollNo }))) {
      await new User({ username: rollNo, email: safeEmail, password: "123456", role: "student" }).save();
    }
    res.json({ message: "Added" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.post("/students/bulk", async (req, res) => {
  try {
    const students = req.body;
    let added = 0;
    for (const s of students) {
      if (!await Student.findOne({ rollNo: s.rollNo }) && s.name && s.rollNo) {
        const email = s.email || "";
        await new Student({ name: s.name, rollNo: s.rollNo, sem: s.sem || "1", dept: s.dept || "Gen", email: email, status: "Enrolled" }).save();
        if (!(await User.findOne({ username: s.rollNo }))) {
          await new User({ username: s.rollNo, email: email, password: "123456", role: "student" }).save();
        }
        added++;
      }
    }
    res.json({ message: `Uploaded ${added} students.` });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.put("/students/:id", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) { }
});
app.delete("/students/:id", async (req, res) => {
  try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { }
});

// ALLOCATION ROUTES
app.post("/allocate", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId }); res.json({ message: "Allocated" }); } catch (e) { }
});
app.post("/allocate/class", async (req, res) => {
  try {
    const { dept, sem, facultyId } = req.body;
    await Student.updateMany({ dept, sem }, { $set: { proctorId: facultyId } });
    res.json({ message: "Class Allocated" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});

// START
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});   */


/*require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// 👇 SERVES YOUR HTML FILES ON PORT 5000 👇
app.use(express.static(__dirname));

// ================= DB CONNECTION =================
// Using local DB connection string directly to ensure it works
const MONGO_URI = "mongodb://127.0.0.1:27017/eduachieve";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) { }

    // 👇 AUTO-CREATE ADMIN USER IF MISSING 👇
    const admin = await User.findOne({ username: "admin" });
    if (!admin) {
      await new User({
        username: "admin",
        email: "singhsurita001@gmail.com", // Updated to your email
        password: "admin",      // Default password
        role: "admin"
      }).save();
      console.log("👑 Admin Account Created: username='admin', password='admin'");
    }
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= 📧 EMAIL CONFIGURATION =================
// 👇👇👇 UPDATED WITH YOUR CREDENTIALS 👇👇👇
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // 1. YOUR REAL GMAIL ADDRESS:
    user: 'singhsurita001@gmail.com',

    // 2. YOUR 16-DIGIT APP PASSWORD:
    pass: 'cfta tcqr fstf exuf'
  }
});
// 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆

// OTP Storage
const otpStore = new Map();

// ================= ROUTES =================

// Auto-open Login Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// 1. LOGIN
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// 2. SEND OTP (EMAIL)
app.post("/send-otp", async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findOne({ username, email });

    if (!user) return res.status(404).json({ message: "Username and Email do not match." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(username, otp);
    setTimeout(() => otpStore.delete(username), 5 * 60 * 1000);

    const mailOptions = {
      from: '"EduAchieve Security" <singhsurita001@gmail.com>',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is: ${otp}`
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
    res.json({ message: `OTP sent to ${email}. Check your Inbox.` });

  } catch (err) {
    console.error("Email Failed:", err);
    // Fallback if email fails
    console.log(`⚠️ FALLBACK OTP: ${otpStore.get(req.body.username)}`);
    // IMPORTANT: Sending success status (200) even if email fails so page moves forward in DEV mode
    // Ideally, you fix the email, but this ensures the UI doesn't freeze.
    res.status(500).json({ message: "Email failed. Check console for OTP." });
  }
});

// 3. VERIFY OTP
app.post("/verify-reset-password", async (req, res) => {
  try {
    const { username, otp, newPassword } = req.body;
    if (otpStore.get(username) !== otp) return res.status(400).json({ message: "Invalid OTP" });

    await User.findOneAndUpdate({ username }, { password: newPassword });
    otpStore.delete(username);
    res.json({ message: "Password reset successful!" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ADMIN ROUTES
app.get("/users", async (req, res) => {
  try { res.json(await User.find()); } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.post("/admin/update-user", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const update = {};
    if (email) update.email = email;
    if (password) update.password = password;

    // Ensure email is saved to User model
    await User.findOneAndUpdate({ username }, update);

    // Also try to update the Student/Faculty profile if it matches
    await Student.findOneAndUpdate({ rollNo: username }, { email: email });

    // For faculty (matching name roughly to username is hard, so we skip auto-sync for now)

    res.json({ message: "Updated successfully" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});

// FACULTY ROUTES
app.get("/faculty", async (req, res) => {
  try { res.json(await Faculty.find()); } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, email, roles } = req.body;
    await new Faculty({ name, dept, email, roles }).save();

    // Create Login
    const username = name.replace(/\s+/g, '').toLowerCase();
    const safeEmail = email || "";
    if (!(await User.findOne({ username }))) {
      await new User({ username, email: safeEmail, password: "123456", role: "faculty" }).save();
    }
    res.json({ message: "Added" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.put("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) { }
});
app.delete("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { }
});

// STUDENT ROUTES
app.get("/students", async (req, res) => {
  try { res.json(await Student.find()); } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, email, status } = req.body;
    if (await Student.findOne({ rollNo })) return res.status(400).json({ message: "Exists" });
    await new Student({ name, rollNo, sem, dept, email, status }).save();

    // Create Login
    const safeEmail = email || "";
    if (!(await User.findOne({ username: rollNo }))) {
      await new User({ username: rollNo, email: safeEmail, password: "123456", role: "student" }).save();
    }
    res.json({ message: "Added" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.post("/students/bulk", async (req, res) => {
  try {
    const students = req.body;
    let added = 0;
    for (const s of students) {
      if (!await Student.findOne({ rollNo: s.rollNo }) && s.name && s.rollNo) {
        const email = s.email || "";
        await new Student({ name: s.name, rollNo: s.rollNo, sem: s.sem || "1", dept: s.dept || "Gen", email: email, status: "Enrolled" }).save();
        if (!(await User.findOne({ username: s.rollNo }))) {
          await new User({ username: s.rollNo, email: email, password: "123456", role: "student" }).save();
        }
        added++;
      }
    }
    res.json({ message: `Uploaded ${added} students.` });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.put("/students/:id", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) { }
});
app.delete("/students/:id", async (req, res) => {
  try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { }
});

// SEMESTER PROMOTION ROUTE
app.post("/students/promote", async (req, res) => {
  try {
    const { dept, fromSem } = req.body;
    if (!dept || !fromSem) return res.status(400).json({ message: "Missing fields" });
    const currentSemInt = parseInt(fromSem);

    if (currentSemInt >= 8) {
      const result = await Student.updateMany({ dept, sem: fromSem }, { $set: { status: "Alumni", sem: "Graduated" } });
      res.json({ message: `🎓 ${result.modifiedCount} Students marked as Alumni.` });
    } else {
      const nextSem = (currentSemInt + 1).toString();
      const result = await Student.updateMany({ dept, sem: fromSem }, { $set: { sem: nextSem } });
      res.json({ message: `🚀 ${result.modifiedCount} Students promoted to Sem ${nextSem}.` });
    }
  } catch (err) { res.status(500).json({ message: "Promotion failed" }); }
});


// ALLOCATION ROUTES
app.post("/allocate", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId }); res.json({ message: "Allocated" }); } catch (e) { }
});
app.post("/allocate/class", async (req, res) => {
  try {
    const { dept, sem, facultyId } = req.body;
    await Student.updateMany({ dept, sem }, { $set: { proctorId: facultyId } });
    res.json({ message: "Class Allocated" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});

// START
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
}); */



const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

// Import models
const { User, Student, Faculty } = require("./model");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// 👇 SERVES YOUR HTML FILES ON PORT 5000 👇
app.use(express.static(__dirname));

// ================= DB CONNECTION =================
// 👇 UPDATED: CONNECTING TO YOUR CLOUD ATLAS DATABASE 👇
const MONGO_URI = "mongodb+srv://suritasingh22_db_user:Surita123@cluster0.j2qdb5n.mongodb.net/Eduachieve?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Atlas Connected Successfully");
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) { }

    // 👇 AUTO-CREATE ADMIN USER IF MISSING 👇
    const admin = await User.findOne({ username: "admin" });
    if (!admin) {
      await new User({
        username: "admin",
        email: "singhsurita001@gmail.com",
        password: "admin",      // Default password
        role: "admin"
      }).save();
      console.log("👑 Admin Account Created: username='admin', password='admin'");
    }
  })
  .catch(err => {
    console.log("❌ DB Connection Error. Check your internet connection.");
    console.log(err);
  });

// ================= 📧 EMAIL CONFIGURATION =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // 1. YOUR REAL GMAIL ADDRESS:
    user: 'singhsurita001@gmail.com',

    // 2. YOUR 16-DIGIT APP PASSWORD:
    pass: 'cfta tcqr fstf exuf'
  }
});

// OTP Storage
const otpStore = new Map();

// ================= ROUTES =================

// Auto-open Login Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// 1. LOGIN
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await User.findOne({ username, password, role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", role: user.role });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// 2. SEND OTP (EMAIL)
app.post("/send-otp", async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findOne({ username, email });

    if (!user) return res.status(404).json({ message: "Username and Email do not match." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(username, otp);
    setTimeout(() => otpStore.delete(username), 5 * 60 * 1000);

    const mailOptions = {
      from: '"EduAchieve Security" <singhsurita001@gmail.com>',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is: ${otp}`
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
    res.json({ message: `OTP sent to ${email}. Check your Inbox.` });

  } catch (err) {
    console.error("Email Failed:", err);
    // Fallback if email fails
    console.log(`⚠️ FALLBACK OTP: ${otpStore.get(req.body.username)}`);
    // Sending success to let frontend continue (Dev mode)
    res.status(500).json({ message: "Email failed. Check console for OTP." });
  }
});

// 3. VERIFY OTP
app.post("/verify-reset-password", async (req, res) => {
  try {
    const { username, otp, newPassword } = req.body;
    if (otpStore.get(username) !== otp) return res.status(400).json({ message: "Invalid OTP" });

    await User.findOneAndUpdate({ username }, { password: newPassword });
    otpStore.delete(username);
    res.json({ message: "Password reset successful!" });
  } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ADMIN ROUTES
app.get("/users", async (req, res) => {
  try { res.json(await User.find()); } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.post("/admin/update-user", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const update = {};
    if (email) update.email = email;
    if (password) update.password = password;

    await User.findOneAndUpdate({ username }, update);
    await Student.findOneAndUpdate({ rollNo: username }, { email: email });

    res.json({ message: "Updated successfully" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});

// FACULTY ROUTES
app.get("/faculty", async (req, res) => {
  try { res.json(await Faculty.find()); } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.post("/faculty", async (req, res) => {
  try {
    const { name, dept, email, roles } = req.body;
    await new Faculty({ name, dept, email, roles }).save();

    const username = name.replace(/\s+/g, '').toLowerCase();
    const safeEmail = email || "";
    if (!(await User.findOne({ username }))) {
      await new User({ username, email: safeEmail, password: "123456", role: "faculty" }).save();
    }
    res.json({ message: "Added" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.put("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) { }
});
app.delete("/faculty/:id", async (req, res) => {
  try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { }
});

// STUDENT ROUTES
app.get("/students", async (req, res) => {
  try { res.json(await Student.find()); } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, sem, dept, email, status } = req.body;
    if (await Student.findOne({ rollNo })) return res.status(400).json({ message: "Exists" });
    await new Student({ name, rollNo, sem, dept, email, status }).save();

    const safeEmail = email || "";
    if (!(await User.findOne({ username: rollNo }))) {
      await new User({ username: rollNo, email: safeEmail, password: "123456", role: "student" }).save();
    }
    res.json({ message: "Added" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.post("/students/bulk", async (req, res) => {
  try {
    const students = req.body;
    let added = 0;
    for (const s of students) {
      if (!await Student.findOne({ rollNo: s.rollNo }) && s.name && s.rollNo) {
        const email = s.email || "";
        await new Student({ name: s.name, rollNo: s.rollNo, sem: s.sem || "1", dept: s.dept || "Gen", email: email, status: "Enrolled" }).save();
        if (!(await User.findOne({ username: s.rollNo }))) {
          await new User({ username: s.rollNo, email: email, password: "123456", role: "student" }).save();
        }
        added++;
      }
    }
    res.json({ message: `Uploaded ${added} students.` });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.put("/students/:id", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) { }
});
app.delete("/students/:id", async (req, res) => {
  try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { }
});

// SEMESTER PROMOTION ROUTE
app.post("/students/promote", async (req, res) => {
  try {
    const { dept, fromSem } = req.body;
    if (!dept || !fromSem) return res.status(400).json({ message: "Missing fields" });
    const currentSemInt = parseInt(fromSem);

    if (currentSemInt >= 8) {
      const result = await Student.updateMany({ dept, sem: fromSem }, { $set: { status: "Alumni", sem: "Graduated" } });
      res.json({ message: `🎓 ${result.modifiedCount} Students marked as Alumni.` });
    } else {
      const nextSem = (currentSemInt + 1).toString();
      const result = await Student.updateMany({ dept, sem: fromSem }, { $set: { sem: nextSem } });
      res.json({ message: `🚀 ${result.modifiedCount} Students promoted to Sem ${nextSem}.` });
    }
  } catch (err) { res.status(500).json({ message: "Promotion failed" }); }
});

// ALLOCATION ROUTES
app.post("/allocate", async (req, res) => {
  try { await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId }); res.json({ message: "Allocated" }); } catch (e) { }
});
app.post("/allocate/class", async (req, res) => {
  try {
    const { dept, sem, facultyId } = req.body;
    await Student.updateMany({ dept, sem }, { $set: { proctorId: facultyId } });
    res.json({ message: "Class Allocated" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});

// START
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});