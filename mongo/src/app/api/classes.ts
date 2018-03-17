import { Request, Response, NextFunction } from "express";
import { User, UserData } from "../../models/user";
import {Class, ClassData } from "../../models/class";
import * as crypto from "crypto";
import * as util from "util";
import * as auth from "basic-auth";
const p = util.promisify(crypto.pbkdf2);

export async function getAllClasses(req: Request, res: Response) {
    let classes = await Class.find();
  
    res.json(classes);
}

export async function addClass(req: Request, res: Response)
{
if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
    try{
      let data = {} as UserData;
      data.username = req.body.username;
      data.firstname = req.body.firstname;
      data.lastname = req.body.lastname;
      data.email = req.body.email;
      data.role = req.body.role;
      data.password = req.body.password;
  
      let user = new User(data);
      let salt: string = String(user.salt);
      let pass: string = String(user.password);
      let encBuffer = await p(pass, salt, 10000, 256, "sha512");
      user.password = encBuffer.toString("base64");
      await user.save();
      res.json(user);
    }
    catch(err)
    {
      res.json(err.message);
    }
    }
    else{
      res.status(403); 
      res.send("User not authorized to create");
    }
}