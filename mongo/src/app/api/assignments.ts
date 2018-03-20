import { Request, Response, NextFunction } from "express";
import { Class, ClassData, AssignmentInterface} from "../../models/class";
import * as mongoose from "mongoose";
export function lookupAssignmentNumber(req: Request, res: Response, next: NextFunction,
                                       assignnum: number)
{
  console.log("lookupAssignmentNumber");
  let assignment = res.locals.allClassInfo.assignments[assignnum - 1];
  if (assignment)
  {
    res.locals.assignment = assignment;
  }
  else
    res.json("Assignment does not exist");
  next();
}

export function getAllAssignmentsInClass(req: Request, res: Response, next: NextFunction)
{
  res.json(res.locals.allClassInfo.assignments);
}

export function getOneAssignmentInClass(req: Request, res: Response, next: NextFunction)
{
  console.log("getOneAssignmentInClass");
  res.json(res.locals.assignment);
}

export async function addAssignmentToClass(req: Request, res: Response, next: NextFunction)
{
  if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
    try {
      let Assignment = req.body;
      res.locals.assignment = req.body;
      if (res.locals.assignment){
        console.log(res.locals.assignment);
        await Class.findByIdAndUpdate(res.locals.allClassInfo._id, {$push : {assignments: res.locals.assignment}});
        res.json(res.locals.assignment);
      }
     }
     catch (err)
     {
       res.send(err);
     }
  }
  else
  {
    res.status(403);
    res.send("User not authorized to add assignments");
  }
}

interface AssignmentData extends AssignmentInterface {
  [key: string ] : String | Number | Date | mongoose.Schema.Types.ObjectId
}


export async function updateAssignmentInClass(req: Request, res: Response, next: NextFunction)
{
  console.log("updateAssignmentInClass");
  let data = {class: "", title: "", due: new Date(), points: 0};
  for (let prop in req.body)
  {
    switch (prop)
    {
      case "class": data.class = req.body.class;break;
      case "title": data.title = req.body.title;break;
      case "due": data.due = req.body.due;break;
      case "points": data.points = req.body.points;break;
    }
    /*if (req.body.hasOwnProperty(prop))
    {
        data[prop] = req.body[prop];
    }*/
  }
  try {
    //console.log(res.locals.allClassInfo);
    //console.log(data);
    let num = res.locals.assignment;
    let newClass = await Class.findById(res.locals.allClassInfo._id);
    if (newClass) {
      let assignmentArray = newClass.assignments;
      assignmentArray[num] = data;
      console.log(data);
      console.log(assignmentArray);
      newClass.assignments = assignmentArray;
      await newClass.save();
      res.json(newClass.assignments);
    }
    /*let newClass = await Class.findOneAndUpdate(res.locals.allClassInfo._id,
      { $set: {'assignments.$' : data} });
    res.json(newClass);*/
  }
  catch (err)
  {
    res.json(err);
  }
}

export function deleteAssignmentFromClass(req: Request, res: Response, next: NextFunction)
{
  console.log("deleteAssignmentFromClass");
  res.send("deleteAssignmentFromClass");
}
