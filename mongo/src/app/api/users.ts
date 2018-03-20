import { Request, Response, NextFunction } from "express";
import { User, UserData } from "../../models/user";
import * as crypto from "crypto";
import * as util from "util";
import * as auth from "basic-auth";
const p = util.promisify(crypto.pbkdf2);

export async function Authenticate(req: Request, res: Response, next: NextFunction)
{
  let login = auth(req);
  if(login)
  {
    let user = await User.findOne({"username": login.name});
    if (user) {
      let salt: string = String(user.salt);
      let pass: string = String(login.pass);
      let encBuffer = await p(pass, salt, 10000, 256, "sha512");
      let passToCheck = encBuffer.toString("base64");
      if (passToCheck === user.password){
        console.log("Success");
        res.locals.thisUserRole = user.role;
        next();
      }
      else {
          res.status(401);
          res.set("WWW-Authenticate", 'Basic realm="School database"');
          res.render("Error.hb");
        }
        //getAllUsers(req,res);
    }
    else {
      res.status(401);
      res.set("WWW-Authenticate", 'Basic realm="School database"');
      res.render("Error.hb");
    }
  }
  else {
    res.status(401);
    res.set("WWW-Authenticate", 'Basic realm="School database"');
    res.render("Error.hb");
  }
}
export function Redirect(req: Request, res: Response){
  res.redirect("../api/index.html");
}

export async function getAllUsers(req: Request, res: Response) {
  if (res.locals.thisUserRole == "admin" || res.locals.thisUserRole == "teacher")
  {
    let users = await User.find()

    res.json(users);
  }
  else
  {
    res.status(403);
    res.json("Not authorized to view.");
  }
}

export async function createUser(req: Request, res: Response) {
  if (res.locals.thisUserRole == "admin"){
  try{
    let data = {} as UserData;
    data.username = req.body.username;
    data.firstname = req.body.firstname;
    data.lastname = req.body.lastname;
    data.email = req.body.email;
    data.role = req.body.role;
    data.password = req.body.password;

    let user = new User(data);
    let salt: string = String(user.salt);
    let pass: string = String(user.password);
    let encBuffer = await p(pass, salt, 10000, 256, "sha512");
    user.password = encBuffer.toString("base64");
    await user.save();
    res.json(user);
  }
  catch(err)
  {
    res.json(err.message);
  }
  }
  else{
    res.status(403);
    res.json("User not authorized to create");
  }
}

export async function lookupUser(req: Request,
                                    res: Response,
                                    next: NextFunction,
                                    userId: string  ) {
  let user;
  try{
    user = await User.findById(userId);
  }
  catch(err)
  {
    try{
    user = await User.findOne({username: userId});
    }
    catch(err)
    {
     res.status(404);
     res.json({ message: "User not found" });
    }
    if (!user)
    {
      res.status(404);
      res.json({ message: "User not found" });
    }
  }
  if (user) {
    res.locals.user = user;
    next();
  }
}

export function getOneUser(req: Request, res: Response) {
  if (res.locals.thisUserRole == "teacher" || res.locals.thisUserRole == "admin") {
    res.json(res.locals.user);
  }
  else
  {
    res.status(403);
    res.json("Not authorized to view.");
  }
}

interface DataUserData extends UserData
{
  [key: string]: String
}

export async function updateUser(req: Request, res: Response) {
  if (res.locals.thisUserRole == "admin"){
    try
    {

      let data = {} as DataUserData;
      //fix so not undefined if not updated
      for (let prop in req.body)
      {
        if (req.body.hasOwnProperty(prop))
        {
          if(prop != "salt" && prop != "_id")
            data[prop] = req.body[prop];
          if(prop == "password")
          {
            let salt: string = String(res.locals.user.salt);
            let pass: string = String(req.body[prop]);
            let encBuffer = await p(pass, salt, 10000, 256, "sha512");
            data[prop] = encBuffer.toString("base64");
          }
        }

      }

      let user = await User.findByIdAndUpdate(res.locals.user._id, data, function (err) {if (err) res.json(err)});
      if (user)
      res.json(user);
    }
    catch(err)
    {
      res.json(err);
    }
  }

  else{
    res.status(403);
    res.json("User not authorized to update");
  }

}

export async function deleteUser(req: Request, res: Response)
{
  if (res.locals.thisUserRole == "admin"){
    try{

    let user = await User.findByIdAndRemove(res.locals.user._id);
    if (user)
      res.json(user);
    }
    catch (err)
    {
      res.json(err);
    }
}
  else{
    res.status(403);
    res.json("User not authorized to delete");
  }
}
