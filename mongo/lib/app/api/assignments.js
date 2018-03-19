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
const class_1 = require("../../models/class");
function lookupAssignmentNumber(req, res, next, assignnum) {
    let assignment = res.locals.allClassInfo.assignments[assignnum - 1];
    if (assignment)
        res.locals.assignment = assignment;
    else
        console.log("broke it");
    next();
}
exports.lookupAssignmentNumber = lookupAssignmentNumber;
function getAllAssignmentsInClass(req, res, next) {
    console.log("z");
    next();
}
exports.getAllAssignmentsInClass = getAllAssignmentsInClass;
function getOneAssignmentInClass(req, res, next) {
    res.json(res.locals);
}
exports.getOneAssignmentInClass = getOneAssignmentInClass;
function addAssignmentToClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
            try {
                yield class_1.Class.findByIdAndUpdate(res.locals.allClassInfo._id, { $push: { assignments: res.locals.assignment } }, function (err) {
                    if (err)
                        res.json(err);
                });
                res.json(res.locals.assignment);
            }
            catch (err) {
                res.send(err);
            }
        }
        else {
            res.status(403);
            res.send("User not authorized to add assignments");
        }
    });
}
exports.addAssignmentToClass = addAssignmentToClass;
function updateAssignmentInClass(req, res, next) {
}
exports.updateAssignmentInClass = updateAssignmentInClass;
function deleteAssignmentFromClass(req, res, next) {
}
exports.deleteAssignmentFromClass = deleteAssignmentFromClass;
//# sourceMappingURL=assignments.js.map