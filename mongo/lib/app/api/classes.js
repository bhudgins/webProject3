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
            thisClass.id = classes[i]._id;
            let teacher = yield user_1.User.findById(classes[i].teacher, 'firstname lastname email');
            if (teacher)
                thisClass.teacher = { "firstname": teacher.firstname, "lastname": teacher.lastname,
                    "email": teacher.email };
            result[i] = thisClass;
        }
        res.json(result);
    });
}
exports.getAllClasses = getAllClasses;
function getOneClass(req, res) {
    res.json(res.locals.class);
}
exports.getOneClass = getOneClass;
function lookupClass(req, res, next, classId) {
    return __awaiter(this, void 0, void 0, function* () {
        let newClass;
        try {
            newClass = yield class_1.Class.findById(classId);
        }
        catch (err) {
            try {
                let field1 = classId.substring(0, 4);
                let field2 = classId.substring(4);
                newClass = yield class_1.Class.findOne({ department: field1, number: field2 });
            }
            catch (err) {
                res.status(404);
                res.json({ message: "Class not found" });
            }
        }
        if (newClass) {
            let result = {};
            result.department = newClass.department;
            result.number = newClass.number;
            result.title = newClass.title;
            result.id = newClass._id;
            let teacher = yield user_1.User.findOne({ _id: newClass.teacher }, 'firstname lastname email');
            if (teacher) {
                result.teacher = { "firstname": teacher.firstname,
                    "lastname": teacher.lastname, "email": teacher.email };
            }
            res.locals.class = result;
            res.locals.allClassInfo = newClass;
            next();
        }
        else {
            res.status(404);
            res.json({ message: "Class not found" });
        }
    });
}
exports.lookupClass = lookupClass;
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
            console.log("teacher set");
            return res.locals.teacher;
        }
        else {
            res.status(404);
            res.json({ message: "Teacher not found" });
        }
    });
}
function addClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
            try {
                let data = {};
                data.department = req.body.department;
                data.number = req.body.number;
                data.title = req.body.title;
                let teacher = yield lookUpTeacher(req, res, next, req.body.teacher);
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
/*interface DataClassData {
    [key: string] : String,
}*/
function updateClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
            try {
                let data = {};
                //fix so not undefined if not updated
                for (let prop in req.body) {
                    if (req.body.hasOwnProperty(prop)) {
                        if (prop == "teacher") {
                            console.log("data before lookUpTeacher" + data[prop]);
                            let temp = yield lookUpTeacher(req, res, next, req.body[prop]);
                            console.log(temp);
                            if (temp)
                                data[prop] = temp;
                            console.log("data after lookUpTeacher" + data[prop]);
                        }
                        switch (prop) {
                            case "department":
                                data.department = req.body.department;
                                break;
                            case "number":
                                data.number = req.body.number;
                                break;
                            case "title":
                                data.title = req.body.title;
                                break;
                        }
                    }
                }
                console.log(res.locals.class.id);
                console.log(data);
                let newClass = yield class_1.Class.findByIdAndUpdate(res.locals.class.id, data, function (err) { if (err)
                    res.json(err); });
                if (newClass) {
                    let result = {};
                    result.department = newClass.department;
                    result.number = newClass.number;
                    result.title = newClass.title;
                    result.id = newClass._id;
                    let teacher = yield user_1.User.findOne({ _id: newClass.teacher }, 'firstname lastname email');
                    if (teacher) {
                        result.teacher = { "firstname": teacher.firstname,
                            "lastname": teacher.lastname, "email": teacher.email };
                    }
                    res.json(result);
                }
            }
            catch (err) {
                res.json(err);
            }
        }
        else {
            res.status(403);
            res.send("User not authorized to update.");
        }
    });
}
exports.updateClass = updateClass;
function deleteClass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
            try {
                let thisClass = yield class_1.Class.findByIdAndRemove(res.locals.class.id);
                if (thisClass) {
                    let data = {};
                    data.department = thisClass.department;
                    data.number = thisClass.number;
                    data.title = thisClass.title;
                    data.teacher = thisClass.teacher;
                    res.json(data);
                }
            }
            catch (err) {
                res.json(err);
            }
        }
        else {
            res.status(403);
            res.send("User not authorized to delete");
        }
    });
}
exports.deleteClass = deleteClass;
//# sourceMappingURL=classes.js.map