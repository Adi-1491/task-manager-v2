import { Request, Response } from "express";
import Task from "../models/taskSchema";

interface AuthenticatedRequest extends  Request
{
    user?:{email:string};
}

export const createTask = async (req:AuthenticatedRequest,res:Response):Promise<any> => {
    try{
        const {title, status} = req.body;
        const userEmail = req.user?.email;
        if(!title || !status || !userEmail)
        {
            return res.status(400).json({message:"Title or Status or User Email of task is missing"});
        }
        const task = new Task({title,status,user:userEmail});
        await task.save();
        return res.status(200).json({message:"Task Created Successfully",title,status,userEmail}); //returning the task aswell
    }
    catch(error) {
        return res.send(500).json({message:"Error Creating Task",error});
    }   
}

export const getTasks = async (req:AuthenticatedRequest, res:Response):Promise<any>=> {
    try{
        const userEmail = req.user?.email;
        const tasks = await Task.find({user:userEmail}); //find: finds all the document related to the email
        return res.status(200).json(tasks);
    }
    catch(error)
    {
        return res.status(500).json({message:"Error Creating Task",error});
    }
}

export const updateTask = async (req:AuthenticatedRequest, res:Response):Promise<any>=>{
    try{
        const { id } = req.params;
        const userEmail = req.user?.email;

        const findTask = await Task.findOne({_id:id, user:userEmail});
        if(!findTask)
        {
            return res.status(404).json({message:"Task not found or unauthorized"});
        }

        const { title ,status } = req.body;
        const updateTask = await Task.findByIdAndUpdate(
            id,
            {title,status},
            {new:true}
        );
        return res.status(200).json({message:"Task Updated Successfully",updateTask});
    }
    catch(error)
    {
        return res.status(500).json({message:"Error Creating Task",error});
    }
}

export const deleteTask = async (req:AuthenticatedRequest, res:Response):Promise<any>=>{
    try
    {
        const { id } = req.params;
        const userEmail = req.user?.email;

        const findTask = await Task.findOne({ _id : id, user: userEmail });
        if(!findTask)
        {
            return res.status(404).json({message:"Task not found or unauthorized"});
        }
        const deleteTask = await Task.findByIdAndDelete(id);
        return res.status(200).json({message:"Deleted Successfully",deleteTask});
    }
    catch(error)
    {
        return res.status(500).json({message:"Error Deleting Task",error});
    }
}