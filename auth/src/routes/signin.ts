import express, {Request, Response} from "express";
import  jwt from "jsonwebtoken";
import { body } from "express-validator";

import { Password } from "../services/password";
import { User } from "../models/user";
import { validateRequest } from "../middlewares/vlidate-request";
import { BadRequestError } from "../errors/bad-request-error";


const router = express.Router();

router.post("/api/users/signin",
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Please provide a password'),
  ],
  validateRequest, // middleware to check for errors!
  async (req: Request, res: Response) => {
    const { email, password} = req.body;

    const existingUser = await User.findOne({email});
    //check if user exist using the mail provided
    if(!existingUser){
      throw new BadRequestError('Invalid credentials');
    }
    //check if password is mached using the saved password and provided password provided
    const passwordMatch = await Password.compare(existingUser.password, password);
    if(!passwordMatch){
      throw new BadRequestError('Invalid credentials');
    }

    // if we got here all credetialns are correct- generate JWB and send back in cookie
     //Generating JWT object
     const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!); 

    // Store it on our session
    req.session = {
      jwt: userJwt
    };

    res.status(200).send(existingUser);
});

export { router as signinRouter };
