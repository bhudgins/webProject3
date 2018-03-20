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
    console.log("lookupAssignmentNumber");
    let assignment = res.locals.allClassInfo.assignments[assignnum - 1];
    if (assignment) {
        res.locals.assignment = assignment;
    }
    else
        res.json("Assignment does not exist");
    next();
}
exports.lookupAssignmentNumber = lookupAssignmentNumber;
function getAllAssignmentsInClass(req, res, next) {
    res.json(res.locals.allClassInfo.assignments);
}
exports.getAllAssignmentsInClass = getAllAssignmentsInClass;
function getOneAssignmentInClass(req, res, next) {
    console.log("getOneAssignmentInClass");
    res.json(res.locals.assignment);
}
exports.getOneAssignmentInClass = getOneAssignmentInClass;
function addAssignmentToClass(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
            try {
                let Assignment = req.body;
                res.locals.assignment = req.body;
                if (res.locals.assignment) {
                    console.log(res.locals.assignment);
                    yield class_1.Class.findByIdAndUpdate(res.locals.allClassInfo._id, { $push: { assignments: res.locals.assignment } });
                    res.json(res.locals.assignment);
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
        console.log("updateAssignmentInClass");
        let data = { class: "", title: "", due: new Date(), points: 0 };
        for (let prop in req.body) {
            switch (prop) {
                case "class":
                    data.class = req.body.class;
                    break;
                case "title":
                    data.title = req.body.title;
                    break;
                case "due":
                    data.due = req.body.due;
                    break;
                case "points":
                    data.points = req.body.points;
                    break;
            }
            /*if (req.body.hasOwnProperty(prop))
            {
                data[prop] = req.body[prop];
            }*/
        }
        try {
            //console.log(res.locals.allClassInfo);
            //console.log(data);
            let num = res.locals.assignment;
            let newClass = yield class_1.Class.findById(res.locals.allClassInfo._id);
            if (newClass) {
                let assignmentArray = newClass.assignments;
                assignmentArray[num] = data;
                console.log(data);
                console.log(assignmentArray);
                newClass.assignments = assignmentArray;
                yield newClass.save();
                res.json(newClass.assignments);
            }
            /*let newClass = await Class.findOneAndUpdate(res.locals.allClassInfo._id,
              { $set: {'assignments.$' : data} });
            res.json(newClass);*/
        }
        catch (err) {
            res.json(err);
        }
    });
}
exports.updateAssignmentInClass = updateAssignmentInClass;
function deleteAssignmentFromClass(req, res, next) {
    console.log("deleteAssignmentFromClass");
    res.send("deleteAssignmentFromClass");
}
exports.deleteAssignmentFromClass = deleteAssignmentFromClass;
//# sourceMappingURL=assignments.js.map