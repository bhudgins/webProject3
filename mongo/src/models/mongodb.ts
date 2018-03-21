import * as mongoose from "mongoose";
import { db } from "../config";

export const connection =
  mongoose.connect(
    `mongodb://${db.host}/${db.name}`,
    { user: db.user, pass: db.pass });
