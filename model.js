/*const mongoose = require('mongoose');

// 1. Faculty Schema
const facultySchema = new mongoose.Schema({
    name: String,
    dept: String,
    roles: {
        proctor: { type: Boolean, default: false },
        hod: { type: Boolean, default: false },
        coordinator: { type: Boolean, default: false }
    }
});

// 2. Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    sem: { type: String, required: true },
    dept: { type: String, required: true },
    status: { type: String, default: 'Enrolled' },
    proctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', default: null } // Links to Faculty
});



// 3. User Login Schema (For Admin/Faculty/Student logins)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In real apps, hash this!
    role: { type: String, enum: ['admin', 'faculty', 'student'], required: true }
});

const Faculty = mongoose.model('Faculty', facultySchema);
const Student = mongoose.model('Student', studentSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Faculty, Student, User };*/

/*const mongoose = require('mongoose');

// 1. Faculty Schema (Updated with Roles)
const facultySchema = new mongoose.Schema({
    name: String,
    dept: String,
    roles: {
        proctor: { type: Boolean, default: false },
        hod: { type: Boolean, default: false },
        coordinator: { type: Boolean, default: false }
    }
});

// 2. Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    sem: { type: String, required: true },
    dept: { type: String, required: true },
    status: { type: String, default: 'Enrolled' },
    proctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', default: null } // Links to Faculty
});

// 3. User Login Schema (For Admin/Faculty/Student logins)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In real apps, hash this!
    role: { type: String, enum: ['admin', 'faculty', 'student'], required: true }
});

const Faculty = mongoose.model('Faculty', facultySchema);
const Student = mongoose.model('Student', studentSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Faculty, Student, User };*/


const mongoose = require('mongoose');

// 1. Faculty Schema
const facultySchema = new mongoose.Schema({
    name: String,
    dept: String,
    email: String, // Store email here for reference
    roles: {
        proctor: { type: Boolean, default: false },
        hod: { type: Boolean, default: false },
        coordinator: { type: Boolean, default: false }
    }
});

// 2. Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    email: String, // Store email here for reference
    sem: { type: String, required: true },
    dept: { type: String, required: true },
    status: { type: String, default: 'Enrolled' },
    proctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', default: null }
});

// 3. User Login Schema (THIS WAS MISSING EMAIL)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, default: "" }, // <--- THIS LINE IS CRITICAL
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'faculty', 'student'], required: true }
});

const Faculty = mongoose.model('Faculty', facultySchema);
const Student = mongoose.model('Student', studentSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Faculty, Student, User };