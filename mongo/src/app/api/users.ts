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
  let user = new User(req.body);
  await user.save();

  res.json(user);
}

export async function lookupUser(req: Request,
                                    res: Response,
                                    next: NextFunction,
                                    userId: string  ) {

  let user = await User.findById(userId);

  if (user) {
    res.locals.user = user;
    next();
  }
  else {

    user = await User.findOne({username: userId});
    if (user) {
      res.locals.user = user;
      next();
    }
    else{
     res.status(404);
     res.json({ message: "User not found" });
    }
  }
}

export function getOneUser(req: Request, res: Response) {
  res.json(res.locals.user);
}
