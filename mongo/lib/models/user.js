"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const crypto = require("crypto");
require("./mongodb");
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        maxlength: 32,
        unique: true,
        match: /^[a-zA-Z\d]([a-zA-Z\d]|[_-][a-zA-Z\d])+$/,
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
        match: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "teacher", "student"],
        required: true
    },
    salt: {
        type: String,
        default: crypto.randomBytes(64)
    },
    password: {
        type: String,
        required: true
        /*set: async (password: string) => {
            await p(password, this.salt, 10000, 256, "sha512");
      }*/
    },
});
UserSchema.set('toJSON', {
    getters: false,
    virtuals: false,
    transform: function (doc, obj, options) {
        obj.id = obj._id;
        delete obj._id;
        delete obj.__v;
        delete obj.salt;
        delete obj.password;
        return obj;
    }
});
exports.User = mongoose.model("User", UserSchema);
//# sourceMappingURL=user.js.map