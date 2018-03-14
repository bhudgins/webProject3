import { Request, Response, NextFunction } from "express";
import { Student } from "../../models/student";

export async function getAllStudents(req: Request, res: Response) {
  let students = await Student.find()

  res.json(students);
}

export async function createStudent(req: Request, res: Response) {
  let student = new Student(req.body);
  await student.save();

  res.json(student);
}

export async function lookupStudent(req: Request,
                                    res: Response,
                                    next: NextFunction,
                                    studentId: string  ) {

  let student = await Student.findById(studentId);

  if (student) {
    res.locals.student = student;
    next();
  }
  else {
    res.status(404);
    res.json({ message: "Student not found" });
  }
}
export function getOneStudent(req: Request, res: Response) {
  res.json(res.locals.student);
}
