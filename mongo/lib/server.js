"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const app_1 = require("./app");
console.log(`Listening on port ${config_1.serverPort}`);
app_1.app.listen(config_1.serverPort);
//# sourceMappingURL=server.js.map