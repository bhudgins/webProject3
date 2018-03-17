"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bodyParser = require("body-parser");
const users = require("./users");
exports.router = express_1.Router();
exports.router.use(bodyParser.json());
exports.router.get("/", users.Redirect);
exports.router.use("/", users.Authenticate);
exports.router.param("userid", users.lookupUser);
exports.router.get("/users/", users.getAllUsers);
exports.router.post("/users/", users.createUser);
exports.router.get("/users/:userid", users.getOneUser);
exports.router.put("/users/:userid", users.updateUser);
exports.router.delete("/users/:userid", users.deleteUser);
//# sourceMappingURL=routes.js.map