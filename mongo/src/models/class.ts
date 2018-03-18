import * as mongoose from "mongoose";
import "./mongodb";
import { User } from "./user";

// Date function from stack overflow
function addDays(date: Number, days: any) {
    var result = new Date(date.toString());
    result.setDate(result.getDate() + days);
    return result;
}

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
            validator: (id: mongoose.Schema.Types.ObjectId) =>
              User.findById(id).then(user => {return user && user.role == "teacher"}) as any,
            message: "User ${VALUE} does not exist"
          }
    },
    students:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        /*
            may need work
        */
        validator: (id: number[]) => {
            let allStudents: boolean | null = true;
            for (let i: number = 0; i < id.length; i++)
            {
                User.findById(id[i]).then(user => {
                    allStudents = user && user.role == "student";
                })
            }
            return allStudents;
        }, 
        message: "{VALUE} does not contain all students"
    },
    assignments:{
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class"
        },
        title:{
            type:String,
            trim: true,
        },
        points:{
            type: Number,
            min: 0,
            default: 100
        },
       /* due:{
            type: Date,
            default: () => {
                return addDays(Date.now(), 2);
            }
        }*/
    }
});

export interface ClassData {
    department: String,
    firstname: String,
    number: Number,
    title: String,
    teacher: String | Promise<any>,
    student: String,
    assignments:{
        class: String,
        title: String,
        points: String,
        due: Date
    }
}

export interface ClassDocument extends ClassData, mongoose.Document { }

export const Class = mongoose.model<ClassDocument>("Class", ClassSchema);
