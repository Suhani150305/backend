
/*const express = require("express");
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
mongoose.connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) {}

    // 👇 AUTO-CREATE ADMIN USER IF MISSING 👇
    const admin = await User.findOne({ username: "admin" });
    if (!admin) {
        await new User({ 
            username: "admin", 
            email: "admin@edu.com", 
            password: "admin",      
            role: "admin" 
        }).save();
        console.log("👑 Admin Account Created: username='admin', password='admin'");
    }
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= 📧 EMAIL CONFIGURATION =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // 🔴 1. DELETE THE TEXT BELOW AND TYPE YOUR REAL GMAIL ADDRESS:
    user: 'YOUR_REAL_EMAIL@gmail.com', 
    
    // 🔴 2. DELETE THE TEXT BELOW AND PASTE YOUR 16-DIGIT APP PASSWORD:
    pass: 'xxxx xxxx xxxx xxxx'
  }
});
// ==========================================================

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
    if(!(await User.findOne({ username }))) {
        await new User({ username, email: safeEmail, password: "123456", role: "faculty" }).save();
    }
    res.json({ message: "Added" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.put("/faculty/:id", async (req, res) => {
    try { await Faculty.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) {}
});
app.delete("/faculty/:id", async (req, res) => {
    try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) {}
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
    if(!(await User.findOne({ username: rollNo }))) {
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
                if(!(await User.findOne({ username: s.rollNo }))) {
                    await new User({ username: s.rollNo, email: email, password: "123456", role: "student" }).save();
                }
                added++;
            }
        }
        res.json({ message: `Uploaded ${added} students.` });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.put("/students/:id", async (req, res) => {
    try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) {}
});
app.delete("/students/:id", async (req, res) => {
    try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) {}
});

// ALLOCATION ROUTES
app.post("/allocate", async (req, res) => {
    try { await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId }); res.json({ message: "Allocated" }); } catch (e) {}
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
});*/


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
mongoose.connect("mongodb://127.0.0.1:27017/eduachieve")
  .then(async () => {
    console.log("✅ MongoDB Connected");
    try { await mongoose.connection.collection("faculties").dropIndex("email_1"); } catch (e) {}

    // 👇 AUTO-CREATE ADMIN USER IF MISSING 👇
    const admin = await User.findOne({ username: "admin" });
    if (!admin) {
        await new User({ 
            username: "admin", 
            email: "admin@edu.com", 
            password: "admin",      
            role: "admin" 
        }).save();
        console.log("👑 Admin Account Created: username='admin', password='admin'");
    }
  })
  .catch(err => console.log("❌ DB Error:", err));

// ================= 📧 EMAIL CONFIGURATION =================
// ⚠️⚠️⚠️ YOU MUST EDIT THIS SECTION OR EMAIL WILL NOT WORK ⚠️⚠️⚠️
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // 👇 1. DELETE THE TEXT BELOW AND TYPE YOUR REAL GMAIL ADDRESS:
    user: 'YOUR_REAL_EMAIL@gmail.com', 
    
    // 👇 2. DELETE THE TEXT BELOW AND PASTE YOUR 16-DIGIT APP PASSWORD:
    // (Get this from: Google Account -> Security -> 2-Step Verification -> App Passwords)
    pass: 'xxxx xxxx xxxx xxxx'
  }
});
// ==========================================================

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
        
        await User.findOneAndUpdate({ username }, update);
        // Also try to update student record if it exists
        try { await Student.findOneAndUpdate({ rollNo: username }, { email: email }); } catch(e) {}
        
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
    if(!(await User.findOne({ username }))) {
        await new User({ username, email: safeEmail, password: "123456", role: "faculty" }).save();
    }
    res.json({ message: "Added" });
  } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.put("/faculty/:id", async (req, res) => {
    try { await Faculty.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) {}
});
app.delete("/faculty/:id", async (req, res) => {
    try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) {}
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
    if(!(await User.findOne({ username: rollNo }))) {
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
                if(!(await User.findOne({ username: s.rollNo }))) {
                    await new User({ username: s.rollNo, email: email, password: "123456", role: "student" }).save();
                }
                added++;
            }
        }
        res.json({ message: `Uploaded ${added} students.` });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.put("/students/:id", async (req, res) => {
    try { await Student.findByIdAndUpdate(req.params.id, req.body); res.json({ message: "Updated" }); } catch (e) {}
});
app.delete("/students/:id", async (req, res) => {
    try { await Student.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) {}
});

// SEMESTER PROMOTION ROUTE (New Feature)
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
    try { await Student.findByIdAndUpdate(req.body.studentId, { proctorId: req.body.facultyId }); res.json({ message: "Allocated" }); } catch (e) {}
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