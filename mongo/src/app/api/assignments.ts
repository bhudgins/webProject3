import { Request, Response, NextFunction } from "express";
import { Class } from "../../models/class";

export function lookupAssignmentNumber(req: Request, res: Response, next: NextFunction,
                                       assignnum: number)
{
  let assignment = res.locals.allClassInfo.assignments[assignnum - 1];
  if (assignment)
    res.locals.assignment = assignment;
  else
    console.log("broke it");
  next();
}

export function getAllAssignmentsInClass(req: Request, res: Response, next: NextFunction)
{
  console.log("z");
  next();
}

export function getOneAssignmentInClass(req: Request, res: Response, next: NextFunction)
{
  res.json(res.locals);
}

export async function addAssignmentToClass(req: Request, res: Response, next: NextFunction)
{
  if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
    try {
      await Class.findByIdAndUpdate(res.locals.allClassInfo._id, {$push : {assignments: res.locals.assignment}},
       function (err) {
         if (err)
          res.json(err);
       });
       res.json(res.locals.assignment);
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

export function updateAssignmentInClass(req: Request, res: Response, next: NextFunction)
{

}

export function deleteAssignmentFromClass(req: Request, res: Response, next: NextFunction)
{

}
