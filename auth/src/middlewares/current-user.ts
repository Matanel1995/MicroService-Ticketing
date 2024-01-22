import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface userPayLoad{
    id: string;
    email: string;
}

// this part responsable to be able to add the payload to the req.currentuser property.
declare global{
    namespace Express{
        interface Request{
            currentUser?: userPayLoad;
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) =>{
    // if there is no jwt token in session
    if(!req.session?.jwt){
        return next();
    }

    //decode jwt
    try{
        const payload  =  jwt.verify(req.session.jwt, process.env.JWT_KEY!) as userPayLoad;
        req.currentUser = payload;
    }
    catch(err){

    }

    next();
}