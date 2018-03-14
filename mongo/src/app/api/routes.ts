import { Router } from "express";
import * as bodyParser from "body-parser";
import * as students from "./students";

export const router = Router();

router.use(bodyParser.json());
router.param("studentId", students.lookupStudent);

router.get("/students/", students.getAllStudents);
router.post("/students/", students.createStudent);
router.get("/students/:studentId", students.getOneStudent);
