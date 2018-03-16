import express           = require("express");
import expressHandlebars = require("express-handlebars");
import morgan            = require("morgan");
import bodyParser        = require("body-parser");
import expressSession    = require("express-session");
import sessionFileStore  = require("session-file-store");
import * as helpers from "./helpers";
import * as config from "../config";
//import * as guess from "./guess";
import * as api from "./api/routes";

export const app = express();

// Configure handlebars engine
app.engine("hb", expressHandlebars({
  extname: ".hb",
  helpers: helpers,
}));
app.set("view engine", "hb");

// Logging
if (config.logFormat) {
  app.use(morgan(config.logFormat));
}

// POST data
app.use(bodyParser.urlencoded({ extended: false }));

// Session
const FileStore = sessionFileStore(expressSession);
app.use(expressSession({
  secret: config.sessionSecret,
  store: new FileStore,
  saveUninitialized: false,
  resave: false,
}))


// Routes specific to your application go here:
app.use("/api", api.router);

/*app.get("/download", (req, res) => {
  res.download("./files/hello.txt", "greeting.txt");
})
*/
// Static files
app.use(express.static("./static"));
