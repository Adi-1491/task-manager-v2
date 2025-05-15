import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema';

interface AuthenticatedRequest extends Request // this request object might have user property as well and its an object that contains email
    {
        user?:{email:string}
    }
//using our own custom req type instead of default one 
export const authMiddleware = async(req:AuthenticatedRequest,res:Response,next:NextFunction):Promise<any> => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message:"No token, authorization denied"});
    }
    try{
        const jwtToken = token.split(" ")[1];
        const isVerified = jwt.verify(jwtToken,process.env.JWT_SECRET!) as unknown as {email: string}; //( !=non null assertion) i.e tells ts this value is definitely not null or undefined {email: string} = assumes there is an email
        req.user = isVerified;
        const userData = await User.findOne({email:isVerified.email}) //key:value 
        if(userData)
        {
            next();
        }
    }
    catch(err)
    {
        return res.status(401).json({msg:"Token is not valid"});
    }

}

export default authMiddleware;