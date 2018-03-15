"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const crypto = require("crypto");
const util = require("util");
require("./mongodb");
const p = util.promisify(crypto.pbkdf2);
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        maxlength: 32,
        unique: true,
        match: /[a-Z0-9]+(-|_)*[a-Z0-9]+/,
        required: true
    },
    firstname: {
        type: String,
        trim: true,
        maxlength: 100,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        maxlength: 100,
        required: true
    },
    email: {
        type: String,
        match: /\w+.?\w+@\w+.\w+/,
    },
    role: {
        type: String,
        enum: ["admin", "teacher", "student"]
    },
    salt: {
        type: String,
        default: crypto.randomBytes(64)
    },
    password: {
        type: String,
        default: (password) => {
            yield p(password, salt, 10000, 256, "sha512");
        }
    }
});
exports.User = mongoose.model("User", UserSchema);
//# sourceMappingURL=user.js.map