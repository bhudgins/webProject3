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
function Redirect(req, res) {
    res.redirect("../api/index.html");
}
exports.Redirect = Redirect;
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let users = yield user_1.User.find();
        res.json(users);
    });
}
exports.getAllUsers = getAllUsers;
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = new user_1.User(req.body);
        yield user.save();
        res.json(user);
    });
}
exports.createUser = createUser;
function lookupUser(req, res, next, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield user_1.User.findById(userId);
        if (user) {
            res.locals.user = user;
            next();
        }
        else {
            user = yield user_1.User.findOne({ username: userId });
            if (user) {
                res.locals.user = user;
                next();
            }
            else {
                res.status(404);
                res.json({ message: "User not found" });
            }
        }
    });
}
exports.lookupUser = lookupUser;
function getOneUser(req, res) {
    res.json(res.locals.user);
}
exports.getOneUser = getOneUser;
//# sourceMappingURL=users.js.map