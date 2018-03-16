import * as mongoose from "mongoose";
import * as crypto from "crypto";
import * as util from "util";
import "./mongodb";

const p = util.promisify(crypto.pbkdf2);

const UserSchema = new mongoose.Schema({
  username:{
    type: String,
    maxlength: 32,
    unique: true,
    match: /[a-zA-Z0-9]+(-|_)*[a-zA-Z0-9]+/,
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
    required: true
  },
  role:{
    type: String,
    enum: ["admin", "teacher", "student"],
    required: true
  },
  salt:{
    type: String,
    default: crypto.randomBytes(64)
  },
  password:{
      type: String,
      required: true
     /* set: (password: string) => {
          await p(password, salt, 10000, 256, "sha512");
      }*/
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

export const User = mongoose.model<UserDocument>("User", UserSchema);
