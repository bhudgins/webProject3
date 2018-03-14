import * as mongoose from "mongoose";
import "./mongodb";

const ClassSchema = new mongoose.Schema({
    department:{
        type: String,
        minlength: 4,
        maxlength: 4,
        uppercase: true,
    },
    number:{
        type: Number,
        max: 999,
        min: 100
    },
    title:{
        type: String,
        trim: true,
        maxlength: 200
    },
    teacher:{
        
    },
    students:{},
    assignments:{
        class:{},
        title:{
            type:String,
            trim: true,
        },
        points:{
            type: Number,
            min: 0,
            default: 100
        },
        due:{
            type: Date,
            default: Date.now, // + 2
        }
    }
});

export interface ClassData {
    department: String,
    firstname: String,
    number: Number,
    title: String,
    teacher: String,
    student: String,
    assignments:{
        class: String,
        title: String,
        points: String,
        due: Date
    }
}

export interface ClassDocument extends ClassData, mongoose.Document { }

export const User = mongoose.model<ClassDocument>("Student", ClassSchema);
