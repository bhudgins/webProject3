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

async function lookUpTeacher(req: Request, res:Response, next:NextFunction, userId: string )
{
  let user;
  try{
    user = await User.findById(userId);
  }
  catch(err)
  {
    try{
     user = await User.findOne({username: userId});
    }
    catch(err)
    {
     res.status(404);
     res.json({ message: "Teacher not found" });
     
    }
    
  }
  if (user) {
    res.locals.teacher = user;
    return res.locals.teacher;
  }
  else
  {
    res.status(404);
    res.json({ message: "Teacher not found" });
  }
}
export async function addClass(req: Request, res: Response, next: NextFunction)
{
if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
    try{
      let data = {} as ClassData;
      data.department = req.body.department;
      data.number = req.body.number;
      data.title = req.body.title;

      let teacher = await lookUpTeacher(req, res, next, req.body.teacher);
      //console.log(teacher);
      if(teacher)
      {
        data.teacher = teacher;
      }
      
      //console.log(data.teacher);
  
      //let user = new User(data);
      let newClass = new Class(data);

      res.locals.data = data;
      res.locals.data.id = newClass._id;
      await newClass.save();
      res.json(res.locals.data);
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