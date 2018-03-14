"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bodyParser = require("body-parser");
const students = require("./students");
exports.router = express_1.Router();
exports.router.use(bodyParser.json());
exports.router.param("studentId", students.lookupStudent);
exports.router.get("/students/", students.getAllStudents);
exports.router.post("/students/", students.createStudent);
exports.router.get("/students/:studentId", students.getOneStudent);
//# sourceMappingURL=routes.js.map