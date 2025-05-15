import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';


const app = express();
const PORT = 8000;

app.get('/',(req,res)=>{
    res.send('Hello Jii');
})

app.use(cors()); //enabling cors (allowing requests from different origin eg request will be sent from frontend i.e 3000 to 8000 i.e backend so it will help)

app.use(express.json()); //parsing json req for easy understanding

app.use('/api/users',userRoutes);
app.use('/api/tasks',taskRoutes);

app.listen(PORT,(err)=>{
    if(!err)
        console.log("Server running, App running on port "+PORT);
    else
        console.log("Error",err);
})

mongoose.connect('mongodb://127.0.0.1:27017/task-manager',{
    
})
.then(()=>{
    console.log('Connected to Task Manager DB');
})
.catch((error)=>{
    console.error('Error connecting to Task Manager DB ',error);
})