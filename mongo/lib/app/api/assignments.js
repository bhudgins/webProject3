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
    res.locals.assignmentNum = assignnum - 1;
    let assignment = res.locals.allClassInfo.assignments[assignnum - 1];
    if (assignment) {
        res.locals.assignment = assignment;
    }
    else {
        res.status(400);
        res.json("Assignment does not exist");
    }
    next();
}
exports.lookupAssignmentNumber = lookupAssignmentNumber;
function getAllAssignmentsInClass(req, res, next) {
    res.json(res.locals.allClassInfo.assignments);
}
exports.getAllAssignmentsInClass = getAllAssignmentsInClass;
function getOneAssignmentInClass(req, res, next) {
    res.json(res.locals.assignment);
}
exports.getOneAssignmentInClass = getOneAssignmentInClass;
function addAssignmentToClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
            try {
                let Assignment = {};
                if (req.body.class)
                    Assignment.class = req.body.class;
                if (req.body.title)
                    Assignment.title = req.body.title;
                if (req.body.points)
                    Assignment.points = req.body.points;
                if (req.body.due)
                    Assignment.due = req.body.due;
                if (Assignment) {
                    yield class_1.Class.findByIdAndUpdate(res.locals.allClassInfo._id, { $push: { assignments: Assignment } });
                    res.json(Assignment);
                }
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
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
            try {
                let num = res.locals.assignmentNum;
                let newClass = yield class_1.Class.findById(res.locals.allClassInfo._id);
                if (newClass) {
                    if (req.body.class)
                        newClass.assignments[num].class = req.body.class;
                    if (req.body.title)
                        newClass.assignments[num].title = req.body.title;
                    if (req.body.points)
                        newClass.assignments[num].points = req.body.points;
                    if (req.body.due)
                        newClass.assignments[num].due = req.body.due;
                    let saved2 = yield newClass.update({ assignments: newClass.assignments });
                    if (saved2)
                        res.json(newClass.assignments[num]);
                }
            }
            catch (err) {
                res.json(err);
            }
        }
    });
}
exports.updateAssignmentInClass = updateAssignmentInClass;
function deleteAssignmentFromClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
            let num = res.locals.assignmentNum;
            let newClass = yield class_1.Class.findById(res.locals.allClassInfo._id);
            if (newClass) {
                newClass.assignments.splice(num, 1);
                //console.log(newClass.assignments);
                let saved = yield newClass.update({ assignments: newClass.assignments });
                if (saved) {
                    res.json(res.locals.assignment);
                }
            }
        }
    });
}
exports.deleteAssignmentFromClass = deleteAssignmentFromClass;
//# sourceMappingURL=assignments.js.map