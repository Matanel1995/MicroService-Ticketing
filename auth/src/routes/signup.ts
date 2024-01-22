import express, { Request, Response } from "express";
import  jwt from "jsonwebtoken";
import { body } from "express-validator";
import { BadRequestError } from '../errors/bad-request-error';
import { User } from "../models/user";
import { validateRequest } from "../middlewares/vlidate-request";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest, // middleware to check if got any errors!
  async (req: Request, res: Response) => {

    // check if email allready in system
    const { email , password} = req.body;

    const existingUser =  await User.findOne({ email }); // if Null - free email

    if(existingUser){
      throw new BadRequestError('Email in use!');
    }
    // Hash the password

    // create User and save them to DB
    const user = User.build({email, password});
    await user.save(); // save to mongodb

    //Generating JWT object
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!); 

    // Store it on our session
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);

  }
);

export { router as signupRouter };
