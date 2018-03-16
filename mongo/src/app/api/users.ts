import { Request, Response, NextFunction } from "express";
import { User } from "../../models/user";


export function Redirect(req: Request, res: Response){
  res.redirect("../api/index.html");
}

export async function getAllUsers(req: Request, res: Response) {
  let users = await User.find()

  res.json(users);
}

export async function createUser(req: Request, res: Response) {

  try{
    let user = new User(req.body);
    await user.save();
    res.json(user);
  }
  catch(err)
  {
    res.json(err.message);
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
  res.json(res.locals.user);
}

export async function updateUser(req: Request, res: Response) {  
  try 
  {
    let user = await User.findByIdAndUpdate(res.locals.user._id, req.body, function (err) {if (err) res.json(err)});
    if (user)
     res.json(user);
  }
  catch(err)
  {
    res.json(err);
  }
}

export async function deleteUser(req: Request, res: Response)
{
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