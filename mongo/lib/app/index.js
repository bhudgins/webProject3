"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const expressHandlebars = require("express-handlebars");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const sessionFileStore = require("session-file-store");
const helpers = require("./helpers");
const config = require("../config");
//import * as guess from "./guess";
const api = require("./api/routes");
exports.app = express();
// Configure handlebars engine
exports.app.engine("hb", expressHandlebars({
    extname: ".hb",
    helpers: helpers,
}));
exports.app.set("view engine", "hb");
// Logging
if (config.logFormat) {
    exports.app.use(morgan(config.logFormat));
}
// POST data
exports.app.use(bodyParser.urlencoded({ extended: false }));
// Session
const FileStore = sessionFileStore(expressSession);
exports.app.use(expressSession({
    secret: config.sessionSecret,
    store: new FileStore,
    saveUninitialized: false,
    resave: false,
}));
// Routes specific to your application go here:
exports.app.use("/api", api.router);
/*app.get("/download", (req, res) => {
  res.download("./files/hello.txt", "greeting.txt");
})
*/
// Static files
exports.app.use(express.static("./static"));
//# sourceMappingURL=index.js.map