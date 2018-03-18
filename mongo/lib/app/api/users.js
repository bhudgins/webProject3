"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../models/user");
const crypto = require("crypto");
const util = require("util");
const auth = require("basic-auth");
const p = util.promisify(crypto.pbkdf2);
function Authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let login = auth(req);
        //console.log(login);
        if (login) {
            let user = yield user_1.User.findOne({ "username": login.name });
            console.log(user);
            if (user) {
                let salt = String(user.salt);
                //console.log(salt);
                let pass = String(login.pass);
                let encBuffer = yield p(pass, salt, 10000, 256, "sha512");
                let passToCheck = encBuffer.toString("base64");
                //console.log(passToCheck + ", " + user.password);
                if (passToCheck === user.password) {
                    console.log("Success");
                    res.locals.thisUserRole = user.role;
                    next();
                }
                else {
                    res.status(401);
                    res.set("WWW-Authenticate", 'Basic realm="School database"');
                    res.render("Error.hb");
                }
                //getAllUsers(req,res);
            }
            else {
                res.status(401);
                res.set("WWW-Authenticate", 'Basic realm="School database"');
                res.render("Error.hb");
            }
        }
        else {
            res.status(401);
            res.set("WWW-Authenticate", 'Basic realm="School database"');
            res.render("Error.hb");
        }
    });
}
exports.Authenticate = Authenticate;
function Redirect(req, res) {
    res.redirect("../api/index.html");
}
exports.Redirect = Redirect;
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher") {
            let users = yield user_1.User.find();
            res.json(users);
        }
        else {
            res.status(403);
            res.send("Not authorized to view.");
        }
    });
}
exports.getAllUsers = getAllUsers;
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "admin") {
            try {
                let data = {};
                data.username = req.body.username;
                data.firstname = req.body.firstname;
                data.lastname = req.body.lastname;
                data.email = req.body.email;
                data.role = req.body.role;
                data.password = req.body.password;
                let user = new user_1.User(data);
                let salt = String(user.salt);
                let pass = String(user.password);
                let encBuffer = yield p(pass, salt, 10000, 256, "sha512");
                user.password = encBuffer.toString("base64");
                yield user.save();
                res.json(user);
            }
            catch (err) {
                res.json(err.message);
            }
        }
        else {
            res.status(403);
            res.send("User not authorized to create");
        }
    });
}
exports.createUser = createUser;
function lookupUser(req, res, next, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        try {
            user = yield user_1.User.findById(userId);
        }
        catch (err) {
            try {
                user = yield user_1.User.findOne({ username: userId });
            }
            catch (err) {
                res.status(404);
                res.json({ message: "User not found" });
            }
            if (!user) {
                res.status(404);
                res.json({ message: "User not found" });
            }
        }
        if (user) {
            res.locals.user = user;
            next();
        }
    });
}
exports.lookupUser = lookupUser;
function getOneUser(req, res) {
    if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
        res.json(res.locals.user);
    }
    else {
        res.status(403);
        res.send("Not authorized to view.");
    }
}
exports.getOneUser = getOneUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "admin") {
            try {
                let data = {};
                //fix so not undefined if not updated
                for (let prop in req.body) {
                    if (req.body.hasOwnProperty(prop)) {
                        if (prop != "salt" && prop != "_id")
                            data[prop] = req.body[prop];
                        if (prop == "password") {
                            let salt = String(res.locals.user.salt);
                            //console.log(req.body[prop]);
                            let pass = String(req.body[prop]);
                            //console.log(pass);
                            let encBuffer = yield p(pass, salt, 10000, 256, "sha512");
                            data[prop] = encBuffer.toString("base64");
                        }
                    }
                }
                let user = yield user_1.User.findByIdAndUpdate(res.locals.user._id, data, function (err) { if (err)
                    res.json(err); });
                if (user)
                    res.json(user);
            }
            catch (err) {
                res.json(err);
            }
        }
        else {
            res.status(403);
            res.send("User not authorized to update");
        }
    });
}
exports.updateUser = updateUser;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (res.locals.thisUserRole == "admin") {
            try {
                let user = yield user_1.User.findByIdAndRemove(res.locals.user._id);
                if (user)
                    res.json(user);
            }
            catch (err) {
                res.json(err);
            }
        }
        else {
            res.status(403);
            res.send("User not authorized to delete");
        }
    });
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=users.js.map