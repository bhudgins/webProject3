import * as mongoose from "mongoose";
import "./mongodb";

const UserSchema = new mongoose.Schema({
  username:{
    type: String,
    maxlength: 32,
    unique: true,
    match: /[a-Z0-9]+(-|_)*[a-Z0-9]+/,
    required: true
  },
  firstname:{
    type: String,
    trim: true,
    maxlength: 100,
    required: true
  },
  lastname:{
    type: String,
    trim: true,
    maxlength: 100,
    required: true
  },
  email:{
    type:String,
    match: /\w+.?\w+@\w+.\w+/,
  },
  role:{
    type: String,
    enum: ["admin", "teacher", "student"]
  },
  salt:{
    type: String,

  },
  password:{
    type: String,
  }
});

export interface UserData {
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    role: String,
    salt: String,
    password: String
}

export interface UserDocument extends UserData, mongoose.Document { }

export const User = mongoose.model<UserDocument>("Student", UserSchema);
