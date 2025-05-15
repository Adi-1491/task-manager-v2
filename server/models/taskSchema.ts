import mongoose from "mongoose";

const taskSchema =  new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true,
        enum:['Pending','Completed','pending','completed'] //enum accepts limited number of values(possible values of the field)
    },
    user:{
        type:String,
        require:true
    }
},{timestamps:true});

const Task = mongoose.model("Task",taskSchema);
export default Task; //use default export when file exports only one thing also lets you import without curly braces and name it anything you want