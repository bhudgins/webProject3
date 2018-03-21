import { Request, Response, NextFunction } from "express";
import { Class, ClassData, ClassDocument, AssignmentInterface} from "../../models/class";
import * as mongoose from "mongoose";
export function lookupAssignmentNumber(req: Request, res: Response, next: NextFunction,
                                       assignnum: number)
{
  res.locals.assignmentNum = assignnum - 1;
  let assignment = res.locals.allClassInfo.assignments[assignnum - 1];
  if (assignment)
  {
    res.locals.assignment = assignment;
  }
  else
  {
    res.status(400);
    res.json("Assignment does not exist");
  }
  next();
}

export function getAllAssignmentsInClass(req: Request, res: Response, next: NextFunction)
{
  res.json(res.locals.allClassInfo.assignments);
}

export function getOneAssignmentInClass(req: Request, res: Response, next: NextFunction)
{
  res.json(res.locals.assignment);
}

export async function addAssignmentToClass(req: Request, res: Response, next: NextFunction)
{
  if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
    try {

     let Assignment = {} as AssignmentInterface;

     if(req.body.class)
        Assignment.class = req.body.class;

      if(req.body.title)
        Assignment.title = req.body.title;
      
      if(req.body.points)
        Assignment.points = req.body.points;

      if(req.body.due)
        Assignment.due = req.body.due;

      
      if (Assignment){
       
        await Class.findByIdAndUpdate(res.locals.allClassInfo._id, {$push : {assignments:Assignment}});
        res.json(Assignment);
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


export async function updateAssignmentInClass(req: Request, res: Response, next: NextFunction)
{
  if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
    try{
      let num = res.locals.assignmentNum;
      let newClass = await Class.findById(res.locals.allClassInfo._id);
      if(newClass)
      {
        if(req.body.class)
          newClass.assignments[num].class = req.body.class;

        if(req.body.title)
          newClass.assignments[num].title = req.body.title;
        
        if(req.body.points)
        newClass.assignments[num].points = req.body.points;

        if(req.body.due)
          newClass.assignments[num].due = req.body.due;

     
        let saved2 = await newClass.update({assignments: newClass.assignments});
        if(saved2)
          res.json(newClass.assignments[num]);
      }
    }
    catch(err)
    {
      res.json(err);
    }
  }
}

export async function deleteAssignmentFromClass(req: Request, res: Response, next: NextFunction)
{
  if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
    let num = res.locals.assignmentNum;
    let newClass = await Class.findById(res.locals.allClassInfo._id);
    if(newClass)
    {
      newClass.assignments.splice(num, 1);
      //console.log(newClass.assignments);
      let saved = await newClass.update({assignments: newClass.assignments});
      if(saved)
      {
        res.json(res.locals.assignment);
      }
    }
  }
 
}
