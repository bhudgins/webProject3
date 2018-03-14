import { serverPort } from "./config";
import { app } from "./app";

console.log(`Listening on port ${serverPort}`);
app.listen(serverPort);
