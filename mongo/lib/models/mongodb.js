"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const config_1 = require("../config");
exports.connection = mongoose.connect(`mongodb://${config_1.db.host}/${config_1.db.name}`, { user: config_1.db.user, pass: config_1.db.pass });
//# sourceMappingURL=mongodb.js.map