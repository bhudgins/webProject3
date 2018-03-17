import * as mongoose from "mongoose";
import * as crypto from "crypto";
import * as util from "util";
import "./mongodb";

const UserSchema = new mongoose.Schema({
  username:{
    type: String,
    maxlength: 32,
    unique: true,
    match: /^[a-zA-Z\d]([a-zA-Z\d]|[_-][a-zA-Z\d])+$/,
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
    match: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
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
      /*set: async (password: string) => {
          await p(password, this.salt, 10000, 256, "sha512");
    }*/
  },
  
});

UserSchema.set ('toJSON',{
  getters:false,
  virtuals:false,
  transform:function (doc: any, obj: any, options:any) {
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    delete obj.salt;
    delete obj.password;
    return obj;
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
