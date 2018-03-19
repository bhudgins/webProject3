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
  id: String
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
      thisClass.id = classes[i]._id;
      let teacher = await User.findById(classes[i].teacher, 'firstname lastname email');

      if (teacher)
      thisClass.teacher = {"firstname": teacher.firstname, "lastname": teacher.lastname,
                           "email": teacher.email};
      result[i] = thisClass;
    }
    res.json(result);
}

export function getOneClass(req: Request, res: Response)
{
  res.json(res.locals.class);
}

export async function  lookupClass(req: Request, res: Response, next: NextFunction, classId: string) {
  let newClass;
  try{
    newClass = await Class.findById(classId);
  }
  catch(err)
  {
    try{
      let field1 = classId.substring(0,4);
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
    let result = {} as display;
    result.department = newClass.department;
    result.number = newClass.number;
    result.title = newClass.title;
    result.id = newClass._id;
    let teacher = await User.findOne({_id: newClass.teacher}, 'firstname lastname email');

    if (teacher) {
      result.teacher = {"firstname": teacher.firstname,
       "lastname": teacher.lastname, "email": teacher.email};
    }
    res.locals.class = result;
    res.locals.allClassInfo = newClass;
    next();
  }
  else
  {
    res.status(404);
    res.json({ message: "Class not found" });
  }
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
    console.log("teacher set");
    return res.locals.teacher;
  }
  else
  {
    res.status(404);
    res.json({ message: "Teacher not found" });
  }
}

export async function addClass(req: Request, res: Response, next: NextFunction) {
if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
    try{
      let data = {} as ClassData;
      data.department = req.body.department;
      data.number = req.body.number;
      data.title = req.body.title;

      let teacher = await lookUpTeacher(req, res, next, req.body.teacher);
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

/*interface DataClassData {
    [key: string] : String,
}*/

export async function updateClass(req: Request, res: Response, next: NextFunction) {
  if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
    try
    {

      let data = {} as ClassData;
      //fix so not undefined if not updated
      for (let prop in req.body)
      {
        if (req.body.hasOwnProperty(prop))
        {
          if (prop == "teacher")
          {
            console.log("data before lookUpTeacher" + data[prop]);
            let temp = await lookUpTeacher(req, res, next, req.body[prop]);
            console.log(temp);
            if (temp)
             data[prop] = temp;

            console.log("data after lookUpTeacher" + data[prop]);
          }
          switch (prop)
          {
            case "department": data.department = req.body.department;
                               break;
            case "number":     data.number = req.body.number;
                               break;
            case "title":      data.title = req.body.title;
                               break;
          }
        }
      }

      console.log(res.locals.class.id);
      console.log(data);
      let newClass = await Class.findByIdAndUpdate(res.locals.class.id, data,
        function (err) {if (err) res.json(err)});
      if (newClass)
      {
        let result = {} as display;
        result.department = newClass.department;
        result.number = newClass.number;
        result.title = newClass.title;
        result.id = newClass._id;
        let teacher = await User.findOne({_id: newClass.teacher}, 'firstname lastname email');

        if (teacher) {
          result.teacher = {"firstname": teacher.firstname,
           "lastname": teacher.lastname, "email": teacher.email};
      }
      res.json(result);
      }
    }
    catch(err)
    {
      res.json(err);
    }
  }
  else {
    res.status(403);
    res.send("User not authorized to update.");
  }
}

export async function deleteClass(req: Request, res: Response) {
  if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
    try {
      let thisClass = await Class.findByIdAndRemove(res.locals.class.id);
      if (thisClass) {
        let data = {} as ClassData;
        data.department = thisClass.department;
        data.number = thisClass.number;
        data.title = thisClass.title;
        data.teacher = thisClass.teacher;
        res.json(data);
      }
    }
    catch (err)
    {
      res.json(err);
    }
  }
  else{
    res.status(403);
    res.send("User not authorized to delete");
  }
}
