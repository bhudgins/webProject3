import { Router } from "express";
import * as bodyParser from "body-parser";
import * as users from "./users";

export const router = Router();

router.use(bodyParser.json());

router.get("/", users.Redirect)
router.param("userid", users.lookupUser);

router.get("/users/", users.getAllUsers);
router.post("/users/", users.createUser);
router.get("/users/:userid", users.getOneUser);
router.put("/users/:userid", users.updateUser);
router.delete("/users/:userid", users.deleteUser);
