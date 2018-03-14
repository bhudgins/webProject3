"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Port server should listen on
exports.serverPort = 8000;
// Log format for morgan
exports.sessionSecret = "bunnyslippers";
// Secret for express-session
exports.logFormat = "dev";
exports.db = {
    host: "localhost",
    name: "students",
    user: undefined,
    pass: undefined
};
//# sourceMappingURL=config.js.map