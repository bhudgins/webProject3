"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_1 = require("../../models/student");
function getAllStudents(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let students = yield student_1.Student.find();
        res.json(students);
    });
}
exports.getAllStudents = getAllStudents;
function createStudent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let student = new student_1.Student(req.body);
        yield student.save();
        res.json(student);
    });
}
exports.createStudent = createStudent;
function lookupStudent(req, res, next, studentId) {
    return __awaiter(this, void 0, void 0, function* () {
        let student = yield student_1.Student.findById(studentId);
        if (student) {
            res.locals.student = student;
            next();
        }
        else {
            res.status(404);
            res.json({ message: "Student not found" });
        }
    });
}
exports.lookupStudent = lookupStudent;
function getOneStudent(req, res) {
    res.json(res.locals.student);
}
exports.getOneStudent = getOneStudent;
//# sourceMappingURL=students.js.map