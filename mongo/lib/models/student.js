"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
require("./mongodb");
const StudentSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    gpa: Number,
    classes: [Number]
});
exports.Student = mongoose.model("Student", StudentSchema);
//# sourceMappingURL=student.js.map