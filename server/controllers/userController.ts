import { Request, Response } from "express";
import User from "../models/userSchema";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req:Request, res:Response):Promise<any> => {
    try
    {
        const { email, password } = req.body;
        if(!email || !password)
        {
            return res.status(400).json({message:"Email or password is missing"});
        }
        const userExists = await User.findOne({email});
        if(userExists)
        {
            return res.status(400).json({message:"User Exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10); //hashing 10 times for more secure
        const user = new User({email,password:hashedPassword});
        await user.save();
        return res.status(201).json({message:"User Created",user});
    }
    catch(error)
    {
        return res.status(500).json({message:"Server Error"});
    }
}

export const loginUser = async (req:Request, res:Response):Promise<any> => {
    try{
        const { email,password } = req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email or Password is missing"});
        }
        const userExists = await User.findOne({email}); // returns entire user data even if email is searched
        if(userExists)
        {
            const isValidPassword = await bcrypt.compare(password,userExists.password)
            const secret = process.env.JWT_SECRET;
            if(isValidPassword){
                jwt.sign({ email }, secret as string, { expiresIn: '1D'}, (err,token) => {
                if(err)
                {
                    console.log(err);
                    return res.status(500).json({message:"Token Generation Failed"});
                }
                return res.status(200).json({message:"Logged in",token});
            })}
            else
                return res.status(401).json({message:"Incorrect password"});
        }
        else
        return res.status(404).json({message:"User Does not exist, Register first"});
    }
    catch(error)
    {
        return res.status(500).json({message:"Server Error"});
    }

}

