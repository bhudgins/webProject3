import { Router } from "express";
import * as bodyParser from "body-parser";
import * as users from "./users";
import * as classes from "./classes";
import * as roster from "./roster";

export const router = Router();

router.use(bodyParser.json());

router.get("/", users.Redirect);
router.use("/", users.Authenticate);
router.param("userid", users.lookupUser);

router.get("/users/", users.getAllUsers);
router.post("/users/", users.createUser);
router.get("/users/:userid", users.getOneUser);
router.put("/users/:userid", users.updateUser);
router.delete("/users/:userid", users.deleteUser);

router.param("classid", classes.lookupClass);
router.get("/classes/", classes.getAllClasses);
router.get("/classes/:classid", classes.getOneClass);
router.post("/classes/", classes.addClass);
router.put("/classes/:classid", classes.updateClass);
router.delete("/classes/:classid", classes.deleteClass);

// May need work to deal with multiple params not sure
router.get("/rosters/:classid", roster.GetAllStudentsInClass);
router.put("/rosters/:classid/:userid", roster.addStudentToClass);
router.delete("/rosters/:classid/:userid", roster.deleteStudentFromClass);
