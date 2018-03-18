import { Request, Response, NextFunction } from "express";
import { User, UserData } from "../../models/user";
import {Class, ClassData } from "../../models/class";
import * as crypto from "crypto";
import * as util from "util";
import * as auth from "basic-auth";
const p = util.promisify(crypto.pbkdf2);

interface display
{
  department: String,
  number: Number,
  title: String,
  teacher: {
    firstname: String,
    lastname: String,
    email: String
  }
}

export async function getAllClasses(req: Request, res: Response) {
    let classes = await Class.find({}, 'department number title teacher');
    let result = [];
    for (let i = 0; i < classes.length; i++)
    {
      let thisClass = {} as display;
      thisClass.department = classes[i].department;
      thisClass.number = classes[i].number;
      thisClass.title = classes[i].title;
      let teacher = await User.find({_id: classes[i].teacher}, 'firstname lastname email');

      thisClass.teacher = {"firstname": teacher[0].firstname, "lastname": teacher[0].lastname,
                           "email": teacher[0].email};
      result[i] = thisClass;
    }
    res.json(result);
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

export async function  lookupClass(req: Request, res: Response, next: NextFunction, classId: string) {
  let newClass;
  try{
    newClass = await User.findById(classId);
  }
  catch(err)
  {
    try{
      let field1 = classId.substring(0,3);
      let field2 = classId.substring(4);
      newClass = await Class.findOne({department: field1, number: field2});
    }
    catch(err)
    {
     res.status(404);
     res.json({ message: "Class not found" });
    }
  }
  if (newClass) {
    res.locals.class = newClass;
    return res.locals.class;
  }
  else
  {
    res.status(404);
    res.json({ message: "Class not found" });
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

      let newClass = new Class(data);
      res.locals.data = data
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
