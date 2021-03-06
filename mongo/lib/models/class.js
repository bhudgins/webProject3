"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
require("./mongodb");
const user_1 = require("./user");
// Date function from stack overflow
function addDays(date, days) {
    var result = new Date(date.toString());
    result.setDate(result.getDate() + days);
    return result;
}
const AssignmentSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    title: {
        type: String,
        trim: true,
    },
    points: {
        type: Number,
        min: 0,
        default: 100
    },
    due: {
        type: Date,
        default: () => {
            let now = new Date();
            return now.setDate(now.getDate() + 2);
        },
    }
});
const ClassSchema = new mongoose.Schema({
    department: {
        type: String,
        minlength: 4,
        maxlength: 4,
        uppercase: true,
    },
    number: {
        type: Number,
        max: 999,
        min: 100
    },
    title: {
        type: String,
        trim: true,
        maxlength: 200
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        /*validator: (id: number) => {
            User.findById(id).then(user => {
                return user && user.role == "teacher";
            }) as any;
        },
        message: "{VALUE} is not a valid user."*/
        validate: {
            validator: (id) => user_1.User.findById(id).then(user => { return user && user.role == "teacher"; }),
            message: "User ${VALUE} does not exist"
        }
    },
    students: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        /*
            may need work
        */
        validator: (id) => {
            let allStudents = true;
            for (let i = 0; i < id.length; i++) {
                user_1.User.findById(id[i]).then(user => {
                    allStudents = user && user.role == "student";
                });
            }
            return allStudents;
        },
        message: "{VALUE} does not contain all students"
    },
    assignments: {
        type: [AssignmentSchema]
    },
});
AssignmentSchema.set('toJSON', {
    getters: false,
    virtuals: false,
    transform: function (doc, obj, options) {
        obj.id = obj._id;
        delete obj._id;
        obj.due = doc.due.toLocaleString();
        return obj;
    }
});
exports.Class = mongoose.model("Class", ClassSchema);
//# sourceMappingURL=class.js.map