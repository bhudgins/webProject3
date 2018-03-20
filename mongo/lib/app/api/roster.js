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
function getAllStudentsInClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
            let result = [];
            for (let i = 0; i < res.locals.allClassInfo.students.length; i++) {
                let user = yield user_1.User.findById(res.locals.allClassInfo.students[i]);
                if (user) {
                    result[i] = user;
                }
                else {
                    res.status(400);
                    res.json("Student not found");
                }
            }
            res.json(result);
        }
        else {
            res.status(403);
            res.json("User not authorized to view.");
        }
    });
}
exports.getAllStudentsInClass = getAllStudentsInClass;
function addStudentToClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
            if (res.locals.user.role == "student") {
                try {
                    yield class_1.Class.findByIdAndUpdate(res.locals.allClassInfo._id, { $push: { students: res.locals.user } });
                    res.json(res.locals.user);
                }
                catch (err) {
                    res.json(err);
                }
            }
            else {
                res.status(400);
                res.json("User that you attempted to add is not a student");
            }
        }
        else {
            res.status(403);
            res.json("User not authorized to update classes");
        }
    });
}
exports.addStudentToClass = addStudentToClass;
function deleteStudentFromClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
            if (res.locals.user.role == "student") {
                try {
                    yield class_1.Class.findByIdAndUpdate(res.locals.allClassInfo._id, { $pull: { students: res.locals.user._id } }, function (err) {
                        if (err)
                            res.json(err);
                    });
                    res.json(res.locals.user);
                }
                catch (err) {
                    res.json(err);
                }
            }
            else {
                res.status(400);
                res.json("User that you attempted to remove is not a student");
            }
        }
        else {
            res.status(403);
            res.json("User not authorized to update classes");
        }
    });
}
exports.deleteStudentFromClass = deleteStudentFromClass;
//# sourceMappingURL=roster.js.map