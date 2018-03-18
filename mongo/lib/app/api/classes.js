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
const user_1 = require("../../models/user");
const class_1 = require("../../models/class");
const crypto = require("crypto");
const util = require("util");
const p = util.promisify(crypto.pbkdf2);
function getAllClasses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let classes = yield class_1.Class.find({}, 'department number title teacher');
        let result = [];
        for (let i = 0; i < classes.length; i++) {
            let thisClass = {};
            thisClass.department = classes[i].department;
            thisClass.number = classes[i].number;
            thisClass.title = classes[i].title;
            let teacher = yield user_1.User.find({ _id: classes[i].teacher }, 'firstname lastname email');
            thisClass.teacher = { "firstname": teacher[0].firstname, "lastname": teacher[0].lastname,
                "email": teacher[0].email };
            result[i] = thisClass;
        }
        res.json(result);
    });
}
exports.getAllClasses = getAllClasses;
function lookUpTeacher(req, res, next, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        try {
            user = yield user_1.User.findById(userId);
        }
        catch (err) {
            try {
                user = yield user_1.User.findOne({ username: userId });
            }
            catch (err) {
                res.status(404);
                res.json({ message: "Teacher not found" });
            }
        }
        if (user) {
            res.locals.teacher = user;
            return res.locals.teacher;
        }
        else {
            res.status(404);
            res.json({ message: "Teacher not found" });
        }
    });
}
function lookupClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        try {
            user = yield user_1.User.findById(userId);
        }
        catch (err) {
            try {
                user = yield user_1.User.findOne({ username: userId });
            }
            catch (err) {
                res.status(404);
                res.json({ message: "Teacher not found" });
            }
        }
        if (user) {
            res.locals.teacher = user;
            return res.locals.teacher;
        }
        else {
            res.status(404);
            res.json({ message: "Teacher not found" });
        }
    });
}
exports.lookupClass = lookupClass;
function addClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
            try {
                let data = {};
                data.department = req.body.department;
                data.number = req.body.number;
                data.title = req.body.title;
                let teacher = yield lookUpTeacher(req, res, next, req.body.teacher);
                //console.log(teacher);
                if (teacher) {
                    data.teacher = teacher;
                }
                let newClass = new class_1.Class(data);
                res.locals.data = data;
                res.locals.data.id = newClass._id;
                yield newClass.save();
                res.json(res.locals.data);
            }
            catch (err) {
                res.json(err.message);
            }
        }
        else {
            res.status(403);
            res.send("User not authorized to create");
        }
    });
}
exports.addClass = addClass;
//# sourceMappingURL=classes.js.map