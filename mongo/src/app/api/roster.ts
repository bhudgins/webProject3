import { Request, Response, NextFunction } from "express";
import { User  } from "../../models/user";
import { Class } from "../../models/class";

export async function getAllStudentsInClass(req: Request, res: Response, next: NextFunction)
{
  if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
    let result = [];
    for (let i = 0; i < res.locals.allClassInfo.students.length; i++)
    {
        let user = await User.findById(res.locals.allClassInfo.students[i]);
        if (user)
        {
          result[i] = user;
        }
        else {
          res.status(400);
          res.json("Student not found");
        }
    }
    res.json(result);
  }
  else {
    res.status(403);
    res.json("User not authorized to view.");
  }
}

export async function addStudentToClass(req: Request, res: Response, next: NextFunction)
{
  if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher")
  {
    if (res.locals.user.role == "student")
    {
      try {
      await Class.findByIdAndUpdate(res.locals.allClassInfo._id, { $push: { students: res.locals.user}});
      res.json(res.locals.user);
      }
      catch (err)
      {
        res.json(err);
      }
    }
    else {
      res.status(400);
      res.json("User that you attempted to add is not a student");
    }
  }
  else {
    res.status(403);
    res.json("User not authorized to update classes");
  }
}

export async function deleteStudentFromClass(req: Request, res: Response, next: NextFunction)
{
  if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher")
  {
    if (res.locals.user.role == "student")
    {
      try {
      await Class.findByIdAndUpdate(res.locals.allClassInfo._id, { $pull: { students: res.locals.user._id}},
        function (err) {
          if(err)
            res.json(err);
        });
      res.json(res.locals.user);
      }
      catch(err)
      {
        res.json(err);
      }
    }
    else {
      res.status(400);
      res.json("User that you attempted to remove is not a student");
    }
  }
  else {
      res.status(403);
      res.json("User not authorized to update classes");
    }
}
